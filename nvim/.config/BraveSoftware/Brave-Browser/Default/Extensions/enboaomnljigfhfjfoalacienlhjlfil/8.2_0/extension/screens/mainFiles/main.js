(function () {
  addEventListener("load", (event) => {
    generateSettingsController(ACTUAL_CATEGORIES, false);
  });

  // MARK: - Router

  function showUnlockScreen() {
    queryById("unlockPasswordTextField").classList.remove("error");
    queryById("unlockPasswordTextField").value = "";
    queryById("wrongProtectionPasswordError").style.display = "none";
    showScreen("unlockScreen");
  }

  // MARK: - Power Button

  queryById("showAllButton").onclick = function () {
    generateSettingsController(ACTUAL_CATEGORIES, false);
    showScreen("optionsScreen");
  };

  // Set State

  browser.storage.local.get(
    getConstNotSyncing.extensionIsEnabledData,
    function (obj) {
      const globalDefault = true;
      const status =
        obj[getConstNotSyncing.extensionIsEnabledData] ?? globalDefault;

      document.documentElement.setAttribute("disabled", status != true);
    }
  );

  function blockExtensionListener(changes, area) {
    if (
      area === "local" &&
      changes[getConstNotSyncing.extensionIsEnabledData]
    ) {
      const { newValue } = changes[getConstNotSyncing.extensionIsEnabledData];

      document.documentElement.setAttribute("disabled", !newValue);
    }
  }

  function onOffClickHandler(turnType, element) {
    browser.storage.onChanged.removeListener(blockExtensionListener);

    const blockTimeInMinutes = +element.dataset.value;

    const popUp = document.querySelector(
      `#mainScreen .turn${turnType}PickerPopup`
    );

    popUp.removeAttribute("active");

    if (blockTimeInMinutes !== 0) {
      browser.storage.onChanged.addListener(blockExtensionListener);
    }

    extensionBlockTimerHandler(blockTimeInMinutes, turnType);

    if (turnType === "Off") {
      setToStorage(
        getConstNotSyncing.extensionBlockTime,
        blockTimeInMinutes,
        function () {
          sendCommand(
            getConstNotSyncing.extensionBlockTime,
            blockTimeInMinutes
          );
        }
      );
    }

    if (turnType === "On") {
      setToStorage(
        getConstNotSyncing.extensionEnableTime,
        blockTimeInMinutes,
        function () {
          sendCommand(
            getConstNotSyncing.extensionEnableTime,
            blockTimeInMinutes
          );
        }
      );
    }
  }

  // Click

  queryById("powerButton").onclick = function () {
    browser.storage.local.get(
      getConstNotSyncing.extensionIsEnabledData,
      function (obj) {
        const globalDefault = true;
        const status =
          obj[getConstNotSyncing.extensionIsEnabledData] ?? globalDefault;

        if (status) {
          const turnOffPopUp = document.querySelector(
            "#mainScreen .turnOffPickerPopup"
          );
          const isVisible = turnOffPopUp.hasAttribute("active");

          if (isVisible) {
            turnOffPopUp.removeAttribute("active");
          } else {
            turnOffPopUp.setAttribute("active", "");
          }
        } else {
          const turnOnPopUp = document.querySelector(
            "#mainScreen .turnOnPickerPopup"
          );
          const isVisible = turnOnPopUp.hasAttribute("active");

          if (isVisible) {
            turnOnPopUp.removeAttribute("active");
          } else {
            turnOnPopUp.setAttribute("active", "");
          }
        }
      }
    );
  };

  // Select time for block or enable extension

  const turnOffElements = document
    .querySelector(".turnOffPickerPopup")
    .querySelectorAll(".turnOffElement");

  for (const element of turnOffElements) {
    element.onclick = () => onOffClickHandler("Off", element);
  }

  const turnOnElements = document
    .querySelector(".turnOnPickerPopup")
    .querySelectorAll(".turnOnElement");

  for (const element of turnOnElements) {
    element.onclick = () => onOffClickHandler("On", element);
  }

  // MARK: - Change General Options

  // Hide All Shorts

  document
    .getElementById("untrap_global_hide_all_shorts")
    .addEventListener("change", function () {
      const newValue = this.checked;

      setToStorage("untrap_global_hide_all_shorts", newValue, function () {
        sendCommand("untrap_global_hide_all_shorts", newValue);

        generateSettingsController(ACTUAL_CATEGORIES, false);
      });
    });

  // Hide All Banner Ads

  document
    .getElementById("untrap_global_hide_all_ads")
    .addEventListener("change", function () {
      const newValue = this.checked;

      setToStorage("untrap_global_hide_all_ads", newValue, function () {
        sendCommand("untrap_global_hide_all_ads", newValue);

        generateSettingsController(ACTUAL_CATEGORIES, false);
      });
    });

  // Choose Video Quality

  document
    .getElementById("untrap_global_video_quality")
    .addEventListener("change", function () {
      const selectedQuality = this.value;

      setToStorage("untrap_global_video_quality", selectedQuality, function () {
        sendCommand("untrap_global_video_quality", selectedQuality);

        setVideoQuality(selectedQuality);
      });
    });

  const videoQualityItems = querySelectorAll(
    "#mainScreen .optionWrapper:has(select)"
  );

  for (const index in videoQualityItems) {
    const item = videoQualityItems[index];
    item.onclick = function () {
      showDropdown(item.querySelector("select"));
    };
  }

  // Show Native Player

  document
    .getElementById("untrap_global_show_native_video_player")
    .addEventListener("change", function () {
      const newValue = this.checked;

      setToStorage(
        "untrap_global_show_native_video_player",
        newValue,
        function () {
          sendCommand("untrap_global_show_native_video_player", newValue);

          setNativeVideoPlayer(newValue);
        }
      );
    });

  // Disable Video Autoplay

  document
    .getElementById("untrap_global_disable_video_autoplay")
    .addEventListener("change", function () {
      const newValue = this.checked;

      setToStorage(
        "untrap_global_disable_video_autoplay",
        newValue,
        function () {
          sendCommand("untrap_global_disable_video_autoplay", newValue);

          setVideoAutoPlay(newValue);
        }
      );
    });

  // Skip Video Ads

  document
    .getElementById("untrap_global_skip_video_ads")
    .addEventListener("change", function () {
      const newValue = this.checked;

      setToStorage("untrap_global_skip_video_ads", newValue, function () {
        sendCommand("untrap_global_skip_video_ads", newValue);

        skipYoutubeVideoAds(newValue);
      });
    });
})();

// Generate Settings

function expandNecessarySection() {
  getCurrentTab().then((tabs) => {
    const currentUrl = tabs[0].url;

    if (currentUrl.includes(shortsPageUrlPart)) {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "shortsPage"
      );
    } else if (currentUrl.includes(searchPageUrlPart)) {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "searchPage"
      );
    } else if (currentUrl.includes(videoPageUrlPart)) {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "videoPage"
      );
    } else if (currentUrl.includes(subscriptionsPageUrlPart)) {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "subscriptionsPage"
      );
    } else if (
      currentUrl.includes(channelPageUrlPart1) ||
      currentUrl.includes(channelPageUrlPart2)
    ) {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "channelPage"
      );
    } else if (
      currentUrl.includes(youPageUrlPart1) ||
      currentUrl.includes(youPageUrlPart2)
    ) {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "youPage"
      );
    } else {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        "homePage"
      );
    }
  });
}

function createOption(optionObject) {
  const optionName = getLocalizedOptionName(optionObject.name);
  const optionId = optionObject.id;
  const optionDefaultValue = optionObject.defaultValue;

  const optionParentWrapper = document.createElement("div");
  optionParentWrapper.classList.add("optionParentWrapper");

  const optionWrapper = document.createElement("div");
  optionWrapper.classList.add("optionWrapper");

  // Wrap with label so can activate by click on name

  var label;

  if (optionObject.type === "color") {
    label = document.createElement("div");
  } else {
    label = document.createElement("label");
  }

  label.className = "label";
  label.setAttribute("for", optionId);

  // Create option name

  const labelSpan = document.createElement("span");
  labelSpan.className = "labelSpan";
  labelSpan.innerHTML = optionName;

  // Control Element

  let controlElement;

  if (optionObject.type === "checkbox") {
    const switchLabel = document.createElement("label");
    switchLabel.classList.add("switchLabel");
    switchLabel.classList.add("switch");

    const checkboxInput = document.createElement("input");
    checkboxInput.className = "formCheckbox";
    checkboxInput.id = optionId;
    checkboxInput.setAttribute("type", "checkbox");
    browser.storage.local.get(optionId, function (obj) {
      const value = obj[optionId] ?? optionDefaultValue;
      checkboxInput.checked = value;
    });

    const slider = document.createElement("span");
    slider.classList.add("slider", "round");

    switchLabel.appendChild(checkboxInput);
    switchLabel.appendChild(slider);

    controlElement = switchLabel;
  } else if (optionObject.type === "select") {
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("selectContainer");

    const chevron = document.createElement("i");
    chevron.classList.add("fa-solid");
    chevron.classList.add("fa-caret-down");

    const select = document.createElement("select");
    select.classList.add("selectSelect");
    select.id = optionObject.id;

    browser.storage.local.get(optionId, function (obj) {
      const selectValue = obj[optionId] ?? optionDefaultValue;

      for (const selectOption of optionObject.selects) {
        var opt = document.createElement("option");
        opt.value = selectOption.id;
        opt.innerHTML = getLocalizedOptionName(selectOption.name);
        if (selectOption.id == selectValue) {
          opt.setAttribute("selected", "");
        }
        select.appendChild(opt);
      }
    });

    selectContainer.appendChild(select);
    selectContainer.appendChild(chevron);

    controlElement = selectContainer;
  } else if (optionObject.type === "color") {
    const colorPickerWrapper = document.createElement("div");
    colorPickerWrapper.className = "colorPickerWrapper";

    const colorPickerInput = document.createElement("input");
    colorPickerInput.setAttribute("type", "color");
    colorPickerInput.id = optionId;

    const clearButton = document.createElement("i");
    clearButton.classList.add("fa-solid", "fa-xmark", "resetColorInput");

    browser.storage.local.get([optionId], function (obj) {
      const selectValue = obj[optionId] ?? "default";

      if (selectValue != "default") {
        colorPickerInput.setAttribute("value", selectValue);
      }
    });

    colorPickerWrapper.appendChild(colorPickerInput);
    colorPickerWrapper.appendChild(clearButton);

    controlElement = colorPickerWrapper;
  } else {
    controlElement = document.createElement("div");
  }

  label.appendChild(labelSpan);
  label.appendChild(controlElement);

  optionWrapper.appendChild(label);

  optionParentWrapper.appendChild(optionWrapper);

  // Recursively handle childOffOptions

  if (optionObject.hasOwnProperty("childOffOptions")) {
    const childOptionsWrapper = document.createElement("div");
    childOptionsWrapper.classList.add("childOptionsWrapper");
    childOptionsWrapper.classList.add("childOffOptions");

    for (const childOption of optionObject.childOffOptions) {
      const childOptionWrapper = createOption(childOption);
      childOptionsWrapper.appendChild(childOptionWrapper);
    }

    optionParentWrapper.appendChild(childOptionsWrapper);
  }

  if (optionObject.hasOwnProperty("childOnOptions")) {
    const childOptionsWrapper = document.createElement("div");
    childOptionsWrapper.classList.add("childOptionsWrapper");
    childOptionsWrapper.classList.add("childOnOptions");

    for (const childOption of optionObject.childOnOptions) {
      const childOptionWrapper = createOption(childOption);
      childOptionsWrapper.appendChild(childOptionWrapper);
    }

    optionParentWrapper.appendChild(childOptionsWrapper);
  }

  return optionParentWrapper;
}

async function generateSettingsController(inputCategories, isSearch) {
  const keywords = await getMergedKeywords();
  const tabs = await getCurrentTab();
  if (!isSearch) {
    const currentUrl = tabs[0].url;

    if (ACTUAL_CATEGORIES.length == 0) {
      prepareActualSetting(currentUrl);
    }
  }

  // Clean for case when user changing lang
  queryById("activeCategoryButtonList").innerHTML = "";
  queryById("categoryPickerList").innerHTML = "";
  queryById("settingsContainerSearch").innerHTML = "";
  queryById("settingsContainerDefault").innerHTML = "";

  const filteredCategories = filterCategories(inputCategories, keywords);

  setAllSettingsButton(filteredCategories);

  const categoriesWithoutEmptySection = filteredCategories
    .map((category) => {
      const filteredCategoryGroups = category.categoryGroups.filter(
        (group) => Array.isArray(group.options) && group.options.length > 0
      );

      return {
        ...category,
        categoryGroups: filteredCategoryGroups,
      };
    })
    .filter((category) => category.categoryGroups.length > 0);

  for (const category of categoriesWithoutEmptySection) {
    const categoryName = getLocalizedCategoryName(category.categoryName);

    if (!isSearch) {
      // Category Picker List
      const newCategory = document.createElement("div");
      newCategory.innerHTML = categoryName;
      newCategory.classList.add("category");
      newCategory.setAttribute("categoryId", category.categoryId);
      queryById("categoryPickerList").appendChild(newCategory);

      // Category Picked
      const newCategory2 = document.createElement("div");
      newCategory2.innerHTML = categoryName;
      newCategory2.classList.add("pickedCategory");
      newCategory2.setAttribute("categoryId", category.categoryId);
      queryById("activeCategoryButtonList").appendChild(newCategory2);
    }

    // Fill Options
    const categoryGroups = category.categoryGroups;
    const categoryId = category.categoryId;

    if (categoryGroups.length == 0) {
      continue;
    }

    // Create Section
    const collapsibleSection = document.createElement("div");
    collapsibleSection.className = "collapsibleSection";
    collapsibleSection.setAttribute("categoryId", categoryId);

    if (isSearch) {
      const collapsibleSectionTitle = document.createElement("div");
      collapsibleSectionTitle.className = "collapsibleSectionTitle";
      collapsibleSectionTitle.innerHTML = categoryName;
      collapsibleSection.appendChild(collapsibleSectionTitle);
    }

    for (const group of categoryGroups) {
      const groupObject = group;
      const groupOptions = groupObject.options;

      if (groupOptions.length == 0) {
        continue;
      }

      // Create Group
      const collapsibleSectionBody = document.createElement("div");
      collapsibleSectionBody.className = "settingsGroup";

      if (isSearch || categoryGroups.length > 1) {
        // Add Label for group
        const groupTitleWrapper = document.createElement("div");
        groupTitleWrapper.classList.add("optionsGroupTitle");
        groupTitleWrapper.innerHTML = getLocalizedGroupName(
          groupObject.groupName
        );

        collapsibleSectionBody.appendChild(groupTitleWrapper);
      }

      // Create Group Body
      const settingsGroupBody = document.createElement("div");
      settingsGroupBody.className = "settingsGroupBody";

      collapsibleSectionBody.appendChild(settingsGroupBody);

      for (const option in groupOptions) {
        // Create Option Parent Wrapper
        const optionWrapper = createOption(groupOptions[option]);
        settingsGroupBody.appendChild(optionWrapper);
      }

      collapsibleSection.appendChild(collapsibleSectionBody);
    }

    if (isSearch) {
      queryById("settingsContainerSearch").appendChild(collapsibleSection);
    } else {
      queryById("settingsContainerDefault").appendChild(collapsibleSection);
    }
  }

  if (!isSearch) {
    expandNecessarySection();
  }

  // MARK: - Change Category
  const categoriesButtons = querySelectorAll("#categoryPickerList .category");

  for (const category of categoriesButtons) {
    category.onclick = function () {
      queryById("optionsScreen").setAttribute(
        "displayingCategoryId",
        category.getAttribute("categoryId")
      );
      queryById("optionsScreen").setAttribute("categorypickerisshowing", false);

      // Trigger a scroll to the top to remove the previously scrolled content from the old category.
      var scrollableDiv = document.getElementById("settingsContainer");
      scrollableDiv.scrollTop = 0;
    };
  }

  // MARK: - Checkbox Click
  const checkboxes = document.querySelectorAll(
    "#optionsScreen .optionWrapper:not(:has(.colorPickerWrapper))"
  );

  for (const checkbox of checkboxes) {
    checkbox.onclick = function () {
      event.preventDefault();

      const hiddenInput = checkbox.querySelector(".formCheckbox");
      const checkboxId = hiddenInput.id;

      browser.storage.local.get(checkboxId, function (obj) {
        const defaultValue = findOptionById(checkboxId).defaultValue;

        // Check if exist
        if (defaultValue != null) {
          const status = obj[checkboxId] ?? defaultValue;
          hiddenInput.checked = status ? false : true;

          setToStorage(checkboxId, !status);

          sendCommand(checkboxId);
        }
      });
    };
  }

  // MARK: - Select Option Change
  const selects = document.querySelectorAll("#optionsScreen .selectSelect");

  for (const select of selects) {
    select.onchange = function () {
      setToStorage(select.id, select.value);
      sendCommand(select.id, select.value);
    };
  }

  // Click on row with select
  const itemsWithSelect = querySelectorAll(
    "#optionsScreen .optionWrapper:has(select)"
  );

  for (const index in itemsWithSelect) {
    const item = itemsWithSelect[index];
    item.onclick = function () {
      showDropdown(item.querySelector("select"));
    };
  }

  // MARK: - Color Picker Changed
  const itemsWithColorPicker = querySelectorAll(
    "#optionsScreen .optionWrapper input[type='color']"
  );

  for (const colorPicker of itemsWithColorPicker) {
    colorPicker.oninput = function () {
      colorPicker.setAttribute("value", colorPicker.value);
      setToStorage(colorPicker.id, colorPicker.value, function () {
        sendCommand(colorPicker.id);
      });
    };
  }

  // Click on reset button
  const clearColorPickerArray = querySelectorAll(
    "#optionsScreen .optionWrapper .resetColorInput"
  );

  for (const clearColorPicker of clearColorPickerArray) {
    clearColorPicker.onclick = function () {
      const colorPicker = clearColorPicker.parentNode.querySelector("input");
      colorPicker.value = "#000";
      colorPicker.removeAttribute("value");
      setToStorage(colorPicker.id, "default", function () {
        sendCommand(colorPicker.id);
      });
    };
  }
}

// MARK: Initial count of categories

function setAllSettingsButton(providedCategories) {
  let totalOptionsCount = 0;

  const checkboxKeys = ["type", "name", "id", "defaultValue"];
  const selectKeys = ["type", "name", "id", "defaultValue", "selects"];

  function isMatchingObject(obj, requiredKeys) {
    return requiredKeys.every((key) => obj.hasOwnProperty(key));
  }

  function countMatchingObjects(obj, templates) {
    if (Array.isArray(obj)) {
      obj.forEach((item) => countMatchingObjects(item, templates));
    } else if (typeof obj === "object" && obj !== null) {
      if (templates.some((template) => isMatchingObject(obj, template))) {
        totalOptionsCount++;
      }
      Object.values(obj).forEach((value) =>
        countMatchingObjects(value, templates)
      );
    }
  }

  countMatchingObjects(providedCategories, [checkboxKeys, selectKeys]);

  const count = document.getElementById("showAllButtonCount");

  count.textContent = ` (${totalOptionsCount})`;
}

//MARK: - Select video quality

function setVideoQuality(videoQuality) {
  getCurrentTab().then((tabs) => {
    const tabsId = tabs[0].id;

    //We add the id because event listener in htmlAtrributesManager.js, listens all messages in content scripts
    browser.tabs.sendMessage(tabsId, {
      id: "untrap_global_video_quality",
      action: "setYoutubeVideoQuality",
      videoQuality,
    });
  });
}

function setNativeVideoPlayer(checkedValue) {
  getCurrentTab().then((tabs) => {
    const tabsId = tabs[0].id;

    browser.tabs.sendMessage(tabsId, {
      id: "untrap_global_show_native_video_player",
      action: "setNativeVideoPlayer",
      isShowNativeVideoPlayer: checkedValue,
    });
  });
}

function setVideoAutoPlay(checkedValue) {
  getCurrentTab().then((tabs) => {
    const tabsId = tabs[0].id;

    browser.tabs.sendMessage(tabsId, {
      id: "untrap_global_disable_video_autoplay",
      action: "setVideoAutoPlay",
      isDisableAutoPlay: checkedValue,
    });
  });
}

function skipYoutubeVideoAds(checkedValue) {
  getCurrentTab().then((tabs) => {
    const tabsId = tabs[0].id;

    browser.tabs.sendMessage(tabsId, {
      id: "untrap_global_skip_video_ads",
      action: "skipYoutubeVideoAds",
      isSkipVideoAds: checkedValue,
    });
  });
}

// MARK: - Filter Categories

let previousTerms = [];

function filterCategories(providedCategories, searchTerms) {
  function getUniqueTerms(previousTerms, currentTerms) {
    return previousTerms.filter((term) => !currentTerms.includes(term));
  }

  function shouldExclude(obj, excludeTerm = null) {
    const isCheckbox =
      obj.type === "checkbox" &&
      typeof obj.name === "object" &&
      obj.id !== undefined &&
      !obj.id.includes("exclude") &&
      typeof obj.defaultValue === "boolean";

    const isSelect =
      obj.type === "select" &&
      typeof obj.name === "object" &&
      obj.id !== undefined &&
      !obj.id.includes("exclude") &&
      obj.defaultValue === "home" &&
      Array.isArray(obj.selects);

    const hasAnyTermInNameEn =
      obj.name?.en &&
      typeof obj.id === "string" &&
      (excludeTerm
        ? obj.id.toLowerCase().includes(excludeTerm.toLowerCase())
        : searchTerms?.some((term) =>
            obj.id.toLowerCase().includes(term.toLowerCase())
          ));

    return (isCheckbox || isSelect) && hasAnyTermInNameEn;
  }

  function filterRecursively(obj) {
    if (Array.isArray(obj)) {
      return obj
        .map((item) => filterRecursively(item))
        .filter((item) => item !== undefined);
    } else if (typeof obj === "object" && obj !== null) {
      const filteredObject = {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const filteredValue = filterRecursively(obj[key]);
          if (filteredValue !== undefined) {
            filteredObject[key] = filteredValue;
          }
        }
      }

      if (shouldExclude(filteredObject)) {
        setToStorage(filteredObject.id, true);
        sendCommand(filteredObject.id, true);
        return undefined;
      }

      for (excludeTerm in noLongerExcludedTerms) {
        if (shouldExclude(filteredObject, noLongerExcludedTerms[excludeTerm])) {
          setToStorage(filteredObject.id, false);
          sendCommand(filteredObject.id, false);
        }
      }

      return Object.keys(filteredObject).length > 0
        ? filteredObject
        : undefined;
    }

    return obj;
  }

  const noLongerExcludedTerms = getUniqueTerms(previousTerms, searchTerms);

  previousTerms = searchTerms;

  return filterRecursively(providedCategories);
}

// MARK: - Prepare Actual Setting

const listOfFilteringKeyWords = {
  untrap_global_hide_all_shorts: ["short"],
  untrap_global_hide_all_ads: ["_ads"],
};

function getMergedKeywords() {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(
      Object.keys(listOfFilteringKeyWords),
      function (storedData) {
        let mergedKeywords = [];

        for (let key in listOfFilteringKeyWords) {
          if (storedData[key] === true) {
            mergedKeywords = mergedKeywords.concat(
              listOfFilteringKeyWords[key]
            );
          }
        }
        resolve(mergedKeywords);
      }
    );
  });
}
