let userAgent = window.navigator.userAgent;

// MARK: - Set Device

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  )
) {
  document.documentElement.setAttribute("device", "phone");
  app_device = "phone";
}

// MARK: - Set Browser

function setBrowserName() {
  var browserName = "";

  if (
    userAgent.includes("Safari") &&
    !userAgent.includes("Chrome") &&
    !userAgent.includes("Edge")
  ) {
    // Safari
    browserName = "safari";
  } else if (userAgent.includes("Edg") || userAgent.includes("Edge")) {
    // Edge
    browserName = "edge";
  } else if (userAgent.match(/firefox|fxios/i)) {
    // Firefox
    browserName = "firefox";
  } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    // Chrome (and not Edge)
    browserName = "chrome";
  } else if (userAgent.includes("Whale")) {
    // Whale
    browserName = "whale";
  } else {
    // Default or unrecognized browser
    browserName = "chrome";
  }

  document.documentElement.setAttribute("browser", browserName);
  app_browser = browserName;
}

setBrowserName();

// MARK: - Set Language

function getLangCodeByBrowser() {
  const locale = window.navigator.language || window.navigator.userLanguage;
  const primaryCode = locale.split("-")[0];

  if (primaryCode == "zh" && locale.includes("CN")) {
    return "zh-CN";
  } else if (primaryCode == "zh" && locale.includes("TW")) {
    return "zh-TW";
  } else {
    return primaryCode;
  }
}

function selectLangDropdownOption(language) {
  var selectElement = queryById("extensionLanguageSelect");
  var option = selectElement.querySelector(`option[value="${language}"]`);

  if (option) {
    option.setAttribute("selected", "");
    return true;
  }

  return false;
}

function langSelectHasValue(locale) {
  var selectElement = queryById("extensionLanguageSelect");

  var option = selectElement.querySelector(`option[value="${locale}"]`);

  if (option) {
    return true;
  } else {
    return false;
  }
}

function setLanguage() {
  browser.storage.local.get(
    getConstNotSyncing.extensionLanguage,
    function (obj) {
      const language = obj[getConstNotSyncing.extensionLanguage] ?? "auto";

      if (language == "auto") {
        const userLocale = getLangCodeByBrowser();

        if (langSelectHasValue(userLocale)) {
          app_language = userLocale;
        } else {
          app_language = "en";
        }

        // Set auto in select

        selectLangDropdownOption("auto");
      } else {
        selectLangDropdownOption(language);
        app_language = language;
      }

      if (app_language == "ar" || app_language == "he") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }

      // Language dependent methods
      translateScreens();
      generateDays();
      password_generateDurationsList();
      setBrowserBasedLinks();
      contentFilter_setPlaceholderOnLaunch();
      setShortcut(); // here because first value from translateScreens()
      setTimeout(() => {
        getProStatusFromBG();
      }, 1000);
    }
  );
}

setLanguage();
