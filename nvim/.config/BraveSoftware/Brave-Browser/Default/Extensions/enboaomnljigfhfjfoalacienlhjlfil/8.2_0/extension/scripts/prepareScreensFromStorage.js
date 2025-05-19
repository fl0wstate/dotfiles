// MARK: - Main Screen

// Set General Options Values

function setGeneralOptionsValueFromStorage() {
  browser.storage.local.get(
    [
      "untrap_global_hide_all_shorts",
      "untrap_global_hide_all_ads",
      "untrap_global_video_quality",
      "untrap_global_show_native_video_player",
      "untrap_global_disable_video_autoplay",
      "untrap_global_skip_video_ads",
    ],
    function (obj) {
      const hideAllShortsValue = obj["untrap_global_hide_all_shorts"] ?? false;
      const hideAllAdsValue = obj["untrap_global_hide_all_ads"] ?? false;
      const youtubeVideoQuality = obj["untrap_global_video_quality"] ?? "auto";
      const showNativeVideoPlayer =
        obj["untrap_global_show_native_video_player"] ?? false;
      const disableVideoAutoPlay =
        obj["untrap_global_disable_video_autoplay"] ?? false;
      const skipVideoAds = obj["untrap_global_skip_video_ads"] ?? false;

      queryById("untrap_global_hide_all_shorts").checked = hideAllShortsValue;
      queryById("untrap_global_hide_all_ads").checked = hideAllAdsValue;
      queryById("untrap_global_video_quality").value = youtubeVideoQuality;
      queryById("untrap_global_show_native_video_player").checked =
        showNativeVideoPlayer;
      queryById("untrap_global_disable_video_autoplay").checked =
        disableVideoAutoPlay;
      queryById("untrap_global_skip_video_ads").checked = skipVideoAds;
    }
  );
}

setGeneralOptionsValueFromStorage();

// MARK: - Account Manage Screen

// Set email and password

function setEmailPasswordFromStorage() {
  browser.storage.local.get(
    [getConstNotSyncing.pro_usernameData, getConstNotSyncing.pro_passwordData],
    function (obj) {
      const username = obj[getConstNotSyncing.pro_usernameData] ?? "";
      const password = obj[getConstNotSyncing.pro_passwordData] ?? "";

      queryById("accountManageEmail").value = username;
      queryById("accountManagePassword").value = password;
    }
  );
}

setEmailPasswordFromStorage();

// MARK: - More Screen

// Set extension theme

function setExtensionTheme() {
  browser.storage.local.get(
    getConstNotSyncing.extensionThemeData,
    function (obj) {
      const data = obj[getConstNotSyncing.extensionThemeData] ?? "auto";

      queryById("extensionThemeSelect").value = data;
      document.documentElement.setAttribute("theme", data);
    }
  );
}

setExtensionTheme();

// Set iCloud Syncing

function setIcloudSyncing() {
  browser.storage.local.get(
    getConstNotSyncing.isCloudSyncingData,
    function (obj) {
      const data = obj[getConstNotSyncing.isCloudSyncingData] ?? "off";

      queryById("iCloudSyncingSelect").value = data;
    }
  );
}

setIcloudSyncing();

// Set My Other Apps Block showing

function setMyOtherAppsShowing() {
  browser.storage.local.get(getConst.myOtherAppsData, function (obj) {
    const data = obj[getConst.myOtherAppsData] ?? "showing";

    document.documentElement.setAttribute("myOtherApps", data);

    queryById("moreScreen").setAttribute(
      "isShowMyApp",
      data === "hide" ? false : true
    );
  });
}

setMyOtherAppsShowing();

// Set Login State

function setLoginState() {
  browser.storage.local.get(
    getConstNotSyncing.pro_usernameData,
    function (obj) {
      const data = obj[getConstNotSyncing.pro_usernameData] ?? "";

      if (data != "") {
        queryById("userLoginEmail").innerHTML = data;
        document.documentElement.setAttribute("isLogin", "true");
        app_isLogin = "true";
      }
    }
  );
}

setLoginState();

// MARK: - Password Locking Screen

// Set buttons states

function setButtonStates() {
  browser.storage.local.get(
    [
      getConst.passwordLockingIsActiveData,
      getConst.passwordLockingPasswordData,
      getConst.passwordLockingPromptData,
    ],
    function (obj) {
      const passwordLockingIsActive = obj[getConst.passwordLockingIsActiveData];
      const passwordLockingPassword = obj[getConst.passwordLockingPasswordData];
      const passwordLockingPrompt = obj[getConst.passwordLockingPromptData];

      if (passwordLockingIsActive == true) {
        queryById("passwordProtectionStatusInfo").setAttribute("active", "");

        queryById("protectPasswordTextField").value = passwordLockingPassword;
        queryById("protectPassword2TextField").value = passwordLockingPassword;
        queryById("passwordPromptTextField").value = passwordLockingPrompt;

        queryById("passwordLocking-bottomButtons").setAttribute("active", "");
      }
    }
  );
}

setButtonStates();

// Reset
function password_generateDurationsList() {
  browser.storage.local.get(
    getConst.passwordLockingResetPeriodData,
    function (obj) {
      const selected = obj[getConst.passwordLockingResetPeriodData] ?? 9;

      const durationSelect = queryById("passwordResetPeriodSelect");

      // Clear old

      durationSelect.innerHTML = "";

      for (resetVariant of resetDurationVariants) {
        const option = document.createElement("option");
        option.value = resetVariant.id;
        option.innerHTML = resetVariant.label[app_language];

        if (resetVariant.id == selected) {
          option.selected = true;
        }

        durationSelect.appendChild(option);
      }
    }
  );
}

// MARK: - Password Reset Screen

browser.storage.local.get(
  [
    getConst.passwordLockingResetPeriodData,
    getConstNotSyncing.extensionLanguage,
  ],
  function (obj) {
    const passwordLockingResetPeriod =
      obj[getConst.passwordLockingResetPeriodData] ?? 9;
    const languageFromStorage =
      obj[getConstNotSyncing.extensionLanguage] ?? "auto";

    let currentExtensionLanguage;

    if (languageFromStorage == "auto") {
      const userLocale = getLangCodeByBrowser();

      if (langSelectHasValue(userLocale)) {
        currentExtensionLanguage = userLocale;
      } else {
        currentExtensionLanguage = "en";
      }
    } else {
      currentExtensionLanguage = languageFromStorage;
    }

    const foundObject = resetDurationVariants.find(
      (obj) => obj.id == passwordLockingResetPeriod
    );

    if (foundObject) {
      queryById("resetPeriodDisplayLabel").innerHTML =
        foundObject.label[currentExtensionLanguage];

      // Get the current date
      const currentDate = new Date();

      // Amount of time to add in minutes
      const minutesToAdd = foundObject.amountInMin;

      // Calculate the new date by adding minutes
      const newDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

      // Format the new date
      const formattedDate = newDate.toLocaleString();

      // Set Formatted Date
      queryById("resetDateDisplayLabel").innerHTML = formattedDate;
    }
  }
);

// MARK: - Password Unlocking Screen

// Show buttons if can

browser.storage.local.get(
  [
    getConst.passwordLockingPromptData,
    getConst.passwordLockingResetPeriodData,
    getConst.passwordLockingResetFinalDateData,
    getConst.passwordLockingResetIsActiveData,
  ],
  function (obj) {
    const currentDate = new Date();

    const passwordLockingPrompt = obj[getConst.passwordLockingPromptData] ?? "";
    const passwordLockingResetPeriod =
      obj[getConst.passwordLockingResetPeriodData] ?? 9;
    const passwordLockingResetFinalDate =
      obj[getConst.passwordLockingResetFinalDateData] ?? currentDate;
    const passwordLockingResetIsActive =
      obj[getConst.passwordLockingResetIsActiveData] ?? false;

    if (passwordLockingPrompt != "") {
      queryById("passwordUnlockingShowPromptButton").style.display = "block";
    }

    if (passwordLockingResetPeriod != 0) {
      const normalPasswordLockingResetFinalDate = new Date(
        passwordLockingResetFinalDate
      );

      if (passwordLockingResetIsActive) {
        if (currentDate < normalPasswordLockingResetFinalDate) {
          queryById("passwordUnlockingResetDateDisplaying").style.display =
            "block";
          queryById("passwordUnlockingResetDateDisplaying").innerHTML =
            "Password Reset Date: " +
            normalPasswordLockingResetFinalDate.toLocaleString();
        }
      } else {
        queryById("passwordUnlockingResetPasswordButton").style.display =
          "block";
      }
    }
  }
);

// MARK: - Shortcuts Screen

// Set shortcut

function setShortcut() {
  browser.storage.local.get(getConst.shortcuts[0], function (obj) {
    const data = obj[getConst.shortcuts[0]] ?? null;

    if (data != null) {
      queryById("setHotkeyButton").innerHTML = data.join("+").toUpperCase();
      querySelector(".hotKeyWrapper").classList.add("setted");
    }
  });
}

// MARK: - YouTube Blocking Schedule Screen

// Generate Time Select Options

function generateTimeSelectOptions() {
  function getTimeRanges(interval, language = window.navigator.language) {
    const ranges = [];
    const date = new Date();
    const format = {
      hour: "numeric",
      minute: "numeric",
    };

    for (let minutes = 0; minutes < 24 * 60; minutes = minutes + interval) {
      date.setHours(0);
      date.setMinutes(minutes);
      ranges.push(date.toLocaleTimeString(language, format));
    }

    return ranges;
  }

  const timeRange = getTimeRanges(10, "ru");
  const timeRangeLength = timeRange.length;

  const appSelects = document.querySelectorAll(
    "#youtubeBlockingScheduleScreen .timeSelectField"
  );

  for (const select of appSelects) {
    for (var i = 0; i < timeRangeLength; i++) {
      const option = document.createElement("option");
      option.innerHTML = timeRange[i];
      option.value = timeRange[i];
      select.appendChild(option);
    }
  }
}

generateTimeSelectOptions();

// Generate Days

function generateDays() {
  const WEEKDAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  function translateWeekday(weekdayString) {
    const weekdayIndex = WEEKDAYS.indexOf(weekdayString.toLowerCase());
    if (weekdayIndex < 0) throw new Error(`Unknown weekday "${weekdayString}"`);

    const dummyDate = new Date(2001, 0, weekdayIndex);

    return dummyDate.toLocaleDateString(app_language, { weekday: "short" });
  }

  // Clear old

  queryById("scheduleDaysWrapper").innerHTML = "";

  // Set Days

  for (const day in WEEKDAYS) {
    const dayName = translateWeekday(WEEKDAYS[day]);
    const dayID = DAYS[day];

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("scheduleDay", "active");
    dayDiv.setAttribute("day-id", dayID);
    dayDiv.innerHTML = dayName;
    queryById("scheduleDaysWrapper").appendChild(dayDiv);

    dayDiv.onclick = function () {
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        this.classList.add("active");
      }
    };
  }
}

// Set block the extension checkbox

function scheduledBlocking_getExtensionBlockStatus() {
  browser.storage.local.get(
    getConst.youtubeBlockingScheduleBlockExtensionData,
    function (obj) {
      const data =
        obj[getConst.youtubeBlockingScheduleBlockExtensionData] ?? false;

      const button = queryById("youtubeBlockingScheduleBlockExtensionCheckbox");

      if (button) {
        button.checked = data;
      }
    }
  );
}

scheduledBlocking_getExtensionBlockStatus();

// Set second interval status

function getSecondIntervalStatus() {
  browser.storage.local.get(
    getConst.youtubeBlockingScheduleTimeIntervalsData,
    function (obj) {
      const data = obj[getConst.youtubeBlockingScheduleTimeIntervalsData] ?? [];

      if (data.length > 1) {
        queryById("additionalIntervalRow").style.display = "flex";
        queryById("addAdditionalInterval").style.display = "none";
      }
    }
  );
}

getSecondIntervalStatus();

// Set intervals times

function getIntervalsTimes() {
  browser.storage.local.get(
    getConst.youtubeBlockingScheduleTimeIntervalsData,
    function (obj) {
      const data = obj[getConst.youtubeBlockingScheduleTimeIntervalsData] ?? [];

      if (data.length > 0) {
        queryById("scheduleTimesFirstSelectFrom").value = data[0].from;
        queryById("scheduleTimesFirstSelectTo").value = data[0].to;

        if (data.length > 1) {
          queryById("scheduleTimesSecondSelectFrom").value = data[1].from;
          queryById("scheduleTimesSecondSelectTo").value = data[1].to;
        }
      }
    }
  );
}

getIntervalsTimes();

// Set days

function getDays() {
  browser.storage.local.get(
    getConst.youtubeBlockingScheduleDaysData,
    function (obj) {
      const data = obj[getConst.youtubeBlockingScheduleDaysData] ?? [];
      if (data.length > 0) {
        const daysButtons = document.querySelectorAll(
          "#scheduleDaysWrapper .scheduleDay"
        );

        for (var i = 0; i < daysButtons.length; i++) {
          const dayButton = daysButtons[i];
          if (data.includes(dayButton.getAttribute("day-id"))) {
            dayButton.classList.add("active");
          } else {
            dayButton.classList.remove("active");
          }
        }
      }
    }
  );
}

getDays();

// Set schedule buttons states

function getScheduleButtonsStatus() {
  browser.storage.local.get(
    getConst.youtubeBlockingScheduleIsActiveData,
    function (obj) {
      const data = obj[getConst.youtubeBlockingScheduleIsActiveData] ?? false;

      if (data == true) {
        queryById("youtubeBlockingSchedule-bottomButtons").setAttribute(
          "active",
          ""
        );
      }
    }
  );
}

getScheduleButtonsStatus();

// MARK: - YouTube Blocking Temporary Screen

// Set block the extension checkbox

function temporaryBlocking_getExtensionBlockStatus() {
  browser.storage.local.get(
    getConst.youtubeBlockingTemporaryBlockExtensionData,
    function (obj) {
      const data =
        obj[getConst.youtubeBlockingTemporaryBlockExtensionData] ?? false;

      const button = queryById(
        "youtubeBlockingTemporaryBlockExtensionCheckbox"
      );

      if (button) {
        button.checked = data;
      }
    }
  );
}

temporaryBlocking_getExtensionBlockStatus();

// Generate durations

function temporaryBlocking_generateDurationsList() {
  // Set block duration
  browser.storage.local.get(
    getConst.youtubeBlockingTemporaryDurationData,
    function (obj) {
      const selected =
        obj[getConst.youtubeBlockingTemporaryDurationData] ?? 300;

      const durationSelect = queryById("temporaryBlockingDuration");

      const countBy5Min = 288;
      var currentSeconds = 300; // 5 min

      for (var i = 0; i < countBy5Min; i++) {
        const option = document.createElement("option");
        option.value = currentSeconds;

        const minValue = currentSeconds / 60;

        const objectToDisplay = minValue;

        var displayString = minValue;

        if (currentSeconds == selected) {
          option.selected = true;
        }

        option.innerHTML = displayString;

        durationSelect.appendChild(option);
        currentSeconds += 300;
      }
    }
  );
}

temporaryBlocking_generateDurationsList();

// Set schedule buttons states

function getTemporaryButtonsStatus() {
  browser.storage.local.get(
    getConst.youtubeBlockingTemporaryIsActiveData,
    function (obj) {
      const data = obj[getConst.youtubeBlockingTemporaryIsActiveData] ?? false;

      if (data == true) {
        queryById("youtubeBlockingTemporary-bottomButtons").setAttribute(
          "active",
          ""
        );
      }
    }
  );
}

getTemporaryButtonsStatus();

// MARK: - Opening Timer Screen

// Generate
function generateDurationsList() {
  browser.storage.local.get(
    [getConst.openingTimerValueData, getConst.openingTimerIsActiveData],
    function (obj) {
      const openingTimerIsActive = obj[getConst.openingTimerIsActiveData];

      const selected = obj[getConst.openingTimerValueData] ?? 1;

      const durationSelect = queryById("openingTimerDurationSelect");

      const max = 601;

      for (var i = 1; i < max; i++) {
        const option = document.createElement("option");
        option.value = i;

        var displayString = "";

        displayString += i;

        if (i == selected) {
          option.selected = true;

          if (openingTimerIsActive == true) {
            queryById("launchDelayState").setAttribute("active", "");
          }
        }

        option.innerHTML = displayString;

        durationSelect.appendChild(option);
      }

      if (openingTimerIsActive == true) {
        queryById("openingTimer-bottomButtons").setAttribute("active", "");
      }
    }
  );
}

generateDurationsList();

// Set Message

function getMessage() {
  browser.storage.local.get(getConst.openingTimerMessageData, function (obj) {
    const message = obj[getConst.openingTimerMessageData] ?? "";

    if (message != "") {
      queryById("openingTimerMessage").value = message;
    }
  });
}

getMessage();

// MARK: - Browser Specific Things

function setBrowserBasedLinks() {
  // Rate Link

  const rateLink = document.querySelector(".dynamic-rate-link");

  if (rateLink) {
    if (app_browser == "safari") {
      rateLink.setAttribute(
        "href",
        "https://apps.apple.com/us/app/untrap-for-youtube/id1637438059"
      );
    } else if (app_browser == "firefox") {
      rateLink.setAttribute(
        "href",
        "https://addons.mozilla.org/ru/firefox/addon/untrap-for-youtube/"
      );
    } else if (app_browser == "edge") {
      rateLink.setAttribute(
        "href",
        "https://microsoftedge.microsoft.com/addons/detail/untrap-for-youtube/ngnefladcohhmmibccafkdbcijjoppdo"
      );
    } else {
      rateLink.setAttribute(
        "href",
        "https://chromewebstore.google.com/detail/enboaomnljigfhfjfoalacienlhjlfil"
      );
    }
  }

  // SocialFocus Link

  const socialFocusLink = document.querySelector(".dynamic-socialfocus-link");

  if (socialFocusLink) {
    if (app_browser == "safari") {
      socialFocusLink.setAttribute(
        "href",
        "https://apps.apple.com/us/app/socialfocus-hide-distractions/id1661093205"
      );
    } else if (app_browser == "firefox") {
      socialFocusLink.setAttribute(
        "href",
        "https://addons.mozilla.org/en-US/firefox/addon/socialfocus/"
      );
    } else if (app_browser == "edge") {
      socialFocusLink.setAttribute(
        "href",
        "https://microsoftedge.microsoft.com/addons/detail/socialfocus-hide-distrac/dkkbdagpdnmdakbbchbicnfcoifbdlfc"
      );
    } else {
      socialFocusLink.setAttribute(
        "href",
        "https://chromewebstore.google.com/detail/socialfocus-hide-distract/abocjojdmemdpiffeadpdnicnlhcndcg"
      );
    }
  }
}

// MARK: - More Screen

// Set Scheduled Info

function setYoutubeScheduledBlockingStatusInfo() {
  browser.storage.local.get(
    [getConst.youtubeBlockingScheduleIsActiveData],
    function (obj) {
      const scheduleIsActive =
        obj[getConst.youtubeBlockingScheduleIsActiveData];

      if (scheduleIsActive == true) {
        queryById("youtubeScheduleBlockingStatusInfo").setAttribute(
          "active",
          ""
        );
      } else {
        queryById("youtubeScheduleBlockingStatusInfo").removeAttribute(
          "active",
          ""
        );
      }
    }
  );
}

setYoutubeScheduledBlockingStatusInfo();

// Set Temporary Info

function setYoutubeTemporaryBlockingStatusInfo() {
  browser.storage.local.get(
    [getConst.youtubeBlockingTemporaryIsActiveData],
    function (obj) {
      const temporaryIsActive =
        obj[getConst.youtubeBlockingTemporaryIsActiveData];

      if (temporaryIsActive == true) {
        queryById("youtubeFocusBlockingStatusInfo").setAttribute("active", "");
      } else {
        queryById("youtubeFocusBlockingStatusInfo").removeAttribute(
          "active",
          ""
        );
      }
    }
  );
}

setYoutubeTemporaryBlockingStatusInfo();

// MARK: - Content Filter Screen

// Set channels & videos filter status

function getFiltersStatus() {
  browser.storage.local.get([getConst.filterIsEnabledData], function (obj) {
    const data = obj[getConst.filterIsEnabledData] ?? false;

    if (data) {
      queryById("channelsVideosFilterCounter").setAttribute("active", "");
    } else {
      queryById("channelsVideosFilterCounter").removeAttribute("active", "");
    }
  });
}

getFiltersStatus();

// Set add filter buttons to context menu

function getContentFilterBlockStatus() {
  browser.storage.local.get(
    getConst.blocklistContextMenuButtonsData,
    function (obj) {
      const data = obj[getConst.blocklistContextMenuButtonsData] ?? false;

      const button = queryById("blocklistFilterContextButtons");

      button.checked = data;
    }
  );
}

getContentFilterBlockStatus();

// Set enable filtration checkbox

function getIsFiltrationEnabled() {
  browser.storage.local.get(getConst.filterIsEnabledData, function (obj) {
    const data = obj[getConst.filterIsEnabledData] ?? false;

    const button = queryById("blocklistFilterEnableFilter");

    button.checked = data;
  });
}

getIsFiltrationEnabled();

// Set placeholder

function contentFilter_setPlaceholderOnLaunch() {
  const firstTab = document.querySelector(".firstContenFilterTab");

  if (firstTab) {
    document
      .getElementById("contentFilterField")
      .setAttribute("placeholder", firstTab.getAttribute("data-input"));
  }
}
