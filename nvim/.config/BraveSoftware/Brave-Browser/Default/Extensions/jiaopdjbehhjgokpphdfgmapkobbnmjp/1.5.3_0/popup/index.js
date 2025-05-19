"use strict";
(() => {
  // src/popup/index.ts
  var config = {
    enable: true,
    hideTabs: false,
    hideShorts: true
  };
  window.onload = async () => {
    const data = await chrome.storage.local.get(null);
    if (typeof data.isEnable === "boolean") {
      config.enable = data.isEnable;
    }
    if (typeof data.isHideTabs === "boolean") {
      config.hideTabs = data.isHideTabs;
    }
    if (typeof data.isHideVideos === "boolean") {
      config.hideShorts = data.isHideVideos;
    }
    setToggleAttribute(config.enable);
    document.getElementById("hideShortTabInput").checked = config.hideTabs;
    document.getElementById("hideShortVideoInput").checked = config.hideShorts;
    const tags = {
      /* selector: tag */
      "#description": "ext_desc",
      "#hideShortTabInput + label": "cfg_hide_tab",
      "#hideShortVideoInput + label": "cfg_hide_video",
      "#warn_col": "cfg_warn_col",
      "#warn_msg": "cfg_warn_msg",
      "#warn_fb": "cfg_warn_fb",
      "#warn_or": "cfg_warn_or",
      "#warn_pr": "cfg_warn_pr"
    };
    for (const selector in tags) {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = chrome.i18n.getMessage(tags[selector]);
      }
    }
    const versionElement = document.getElementById("version");
    if (versionElement) {
      versionElement.innerHTML = `v${chrome.runtime.getManifest().version}`;
      versionElement.title = chrome.i18n.getMessage("cfg_ver");
      versionElement.addEventListener("click", () => {
        window.open(
          "https://github.com/doma-itachi/Youtube-shorts-block/releases"
        );
      });
    }
    document.getElementById("more_icon")?.addEventListener("click", () => {
      const element = document.getElementById(
        "more_checkbox"
      );
      element.checked = !element.checked;
    });
    document.getElementById("ghlink")?.addEventListener("click", () => {
      window.open(
        "https://github.com/doma-itachi/Youtube-shorts-block",
        "_blank"
      );
    });
    document.getElementById("toggle_wrap")?.addEventListener("click", () => {
      config.enable = !config.enable;
      chrome.storage.local.set({ isEnable: config.enable });
      setToggleAttribute(config.enable);
    });
    const brand = getBrowserBrand();
    let feedbackURL;
    if (brand === "Chromium") {
      feedbackURL = "https://chrome.google.com/webstore/detail/youtube-shorts-block/jiaopdjbehhjgokpphdfgmapkobbnmjp";
    } else {
      feedbackURL = "https://addons.mozilla.org/firefox/addon/youtube-shorts-block/";
    }
    document.getElementById("warn_fb").href = feedbackURL;
    document.querySelectorAll(".settings_column>input").forEach((element) => {
      element.addEventListener("input", (e) => {
        const target = e.target;
        if (target.id === "hideShortTabInput") {
          chrome.storage.local.set({ isHideTabs: target.checked });
        } else if (target.id === "hideShortVideoInput") {
          chrome.storage.local.set({ isHideVideos: target.checked });
        }
      });
    });
  };
  function setToggleAttribute(isOpen) {
    if (isOpen) {
      chrome.action.setIcon({
        path: {
          "32": "../assets/icon32.png",
          "64": "../assets/icon64.png",
          "128": "../assets/icon128.png"
        }
      });
    } else {
      chrome.action.setIcon({
        path: {
          "32": "../assets/icon32_disabled.png",
          "64": "../assets/icon64_disabled.png",
          "128": "../assets/icon128_disabled.png"
        }
      });
    }
    document.getElementById("logo")?.setAttribute("enabled", isOpen.toString());
    document.getElementById("toggle_wrap")?.setAttribute("checked", isOpen.toString());
    document.getElementById("toggle_circle")?.setAttribute("checked", isOpen.toString());
  }
  function getBrowserBrand() {
    if (navigator.userAgentData && navigator.userAgentData.brands[0].brand === "Chromium") {
      return "Chromium";
    } else {
      return "Firefox";
    }
  }
})();
