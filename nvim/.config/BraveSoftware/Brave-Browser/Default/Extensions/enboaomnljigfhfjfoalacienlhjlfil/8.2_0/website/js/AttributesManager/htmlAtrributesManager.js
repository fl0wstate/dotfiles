// MARK: - Set Desktop/Mobile attribute

function setDeviceTypeAttribute() {
  const desktopUrl = "www.youtube.com";
  const mobileUrl = "m.youtube.com";

  if (location.href.includes(desktopUrl)) {
    // Set to Settings
    queryById("untrap_settings").setAttribute("untrap_is_desktop", true);
    queryById("untrap_settings").setAttribute("untrap_is_mobile", false);

    // Set to HTML
    document.documentElement.setAttribute("untrap_is_desktop", true);
    document.documentElement.setAttribute("untrap_is_mobile", false);
  } else if (location.href.includes(mobileUrl)) {
    // Set to Settings
    queryById("untrap_settings").setAttribute("untrap_is_desktop", false);
    queryById("untrap_settings").setAttribute("untrap_is_mobile", true);

    // Set to HTML
    document.documentElement.setAttribute("untrap_is_desktop", false);
    document.documentElement.setAttribute("untrap_is_mobile", true);
  }
}

// MARK: - Set options values to HTML

function getActualCategoriesForWebsiteAttributes() {
  const currentHref = window.location.href;
  const ATTR_CATEGORIES = [];

  for (const category of CATEGORIES) {
    var actualCategoryGroups = [];

    if (isDesktop(currentHref)) {
      const actualCategory = {
        categoryId: category.categoryId,
        categoryName: category.categoryDesktopName,
        categoryGroups: category.categoryDesktopGroups,
      };

      ATTR_CATEGORIES.push(actualCategory);
    } else if (category.hasOwnProperty("categoryMobileGroups")) {
      const actualCategory = {
        categoryId: category.categoryId,
        categoryName: category.categoryMobileName,
        categoryGroups: category.categoryMobileGroups,
      };

      ATTR_CATEGORIES.push(actualCategory);
    }
  }

  return ATTR_CATEGORIES;
}

function setAttributesToSettingsDiv() {
  if (queryById("untrap_settings") == null) {
    // Create a new <div> element
    const settingsDiv = document.createElement("div");

    // Set the ID attribute of the new <div> element
    settingsDiv.id = "untrap_settings";

    // Insert the new <div> element into the <body>
    document.documentElement.appendChild(settingsDiv);
  }

  setDeviceTypeAttribute();

  for (const option of getAllOptions(
    getActualCategoriesForWebsiteAttributes()
  )) {
    const optionId = option.id;
    const optionDefault = option.defaultValue;

    browser.storage.local.get(optionId, function (obj) {
      const value = obj[optionId] ?? optionDefault;

      // Set in settings

      queryById("untrap_settings").setAttribute(optionId, value);

      // Set in html

      document.documentElement.setAttribute(optionId, value);
    });
  }
}

setAttributesToSettingsDiv();

// MARK: - Update in html

function updateSettingAttribute(settingId, attribute) {
  // Set in settings

  queryById("untrap_settings").setAttribute(settingId, attribute);

  // Set in html
  document.documentElement.setAttribute(settingId, attribute);

  // If on channel page then update now
  if (
    location.href.includes(channelPageUrlPart1) ||
    location.href.includes(channelPageUrlPart2)
  ) {
    hideMenuTabs();
  }

  if (settingId == "untrap_video_page_auto_shows_chapters_in_sidebar") {
    document
      .querySelector("html")
      .setAttribute(
        "untrap_video_page_chapters_in_sidebar_closed_by_user",
        attribute
      );
  }

  // Update Thumbnail Filters
  if (getConst.thumbnailFilterIds.includes(settingId)) {
    setThumbnailFilters();
  }

//  if (settingId == "untrap_header_hide_notifications_counter") {
//    initialTitleFromInit(attribute);
//  }

  // If thumbnail clickbait replacer
  if (settingId == "untrap_video_card_replace_thumbnail") {
    thumbType = attribute;
    startThumbnailReplacing();
    triggerThumbnailUpdate();
  }

  if (settingId == "untrap_appearance_font") {
    setFont();
  }

  if (settingId == "untrap_appearance_color") {
    setAccentColor();
  }

  if (settingId == "untrap_appearance_primary_bg_color") {
    setPrimaryBGColor();
  }
}

// MARK: - Receive Requests from popup

// Here I will check for special ids

browser.runtime.onMessage.addListener((message) => {
  const objectId = message.id;

  browser.storage.local.get(objectId, function (obj) {
    const defaultObject = findOptionById(objectId);
    const currentValue = obj[objectId] ?? defaultObject.defaultValue;
    updateSettingAttribute(objectId, currentValue);
  });
});
