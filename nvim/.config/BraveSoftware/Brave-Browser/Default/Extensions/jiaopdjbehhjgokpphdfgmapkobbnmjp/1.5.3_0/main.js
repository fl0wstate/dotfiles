"use strict";
(() => {
  // src/filter/reelShelf.ts
  function reelShelfFilter() {
    const reels = document.querySelectorAll(
      "ytd-reel-shelf-renderer, ytm-reel-shelf-renderer"
    );
    for (const reel of reels) {
      reel.remove();
    }
  }

  // src/filter/richShelf.ts
  function richShelfFilter() {
    const shelfs = document.querySelectorAll(
      "ytd-rich-shelf-renderer:has(h2>yt-icon:not([hidden]))"
    );
    for (const shelf of shelfs) {
      shelf.remove();
    }
  }

  // src/filter/shorts.ts
  function shortsFilter() {
    const shorts = document.querySelectorAll(
      "ytd-video-renderer ytd-thumbnail a, ytd-grid-video-renderer ytd-thumbnail a, ytm-video-with-context-renderer a.media-item-thumbnail-container"
    );
    const tags = [
      "YTD-VIDEO-RENDERER",
      "YTD-GRID-VIDEO-RENDERER",
      "YTM-VIDEO-WITH-CONTEXT-RENDERER"
    ];
    for (const i of shorts) {
      if (i.href.indexOf("shorts") != -1) {
        let node = i.parentNode;
        while (node) {
          if (tags.includes(node.nodeName)) {
            node.remove();
            break;
          }
          node = node.parentNode;
        }
      }
    }
  }

  // src/util/util.ts
  function logf(message, style) {
    const composed = `[Youtube-shorts block] ${message}`;
    if (style === "error") {
      console.error(composed);
    } else {
      console.log(composed);
    }
  }
  async function querySelectorPromise(selectors, limit = 5, interval = 100) {
    let element;
    for (let i = 0; i < limit; i++) {
      element = document.querySelector(selectors);
      if (element) return element;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }
  async function querySelectorAllPromise(selectors, limit = 5, interval = 100) {
    let elements = document.querySelectorAll(selectors);
    if (elements.length !== 0) return elements;
    for (let i = 0; i < limit - 1; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      elements = document.querySelectorAll(selectors);
      if (elements.length !== 0) return elements;
    }
    return elements;
  }

  // src/main.ts
  var config = {
    enable: true,
    hideTabs: false,
    hideShorts: true
  };
  var Extension = class _Extension {
    observer = null;
    filterList = [
      reelShelfFilter,
      richShelfFilter,
      shortsFilter
    ];
    constructor() {
      if (window.location.hostname.at(0) === "m") {
        window.addEventListener("state-navigatestart", (e) => {
          this.onNavigateStart(
            e.detail.href,
            true
          );
        });
      } else {
        document.addEventListener("yt-navigate-start", (e) => {
          this.onNavigateStart(e.target.baseURI);
        });
      }
      chrome.storage.onChanged.addListener(() => this.loadConfig());
      this.loadConfig();
      const url = _Extension.convertToVideoURL(location.href);
      if (url && config.enable) {
        location.href = url;
      }
      logf("Youtube-shorts block activated.");
    }
    async onNavigateStart(destinationURL, mobile = false) {
      const videoURL = _Extension.convertToVideoURL(destinationURL);
      if (videoURL && config.enable) {
        history.back();
        location.href = videoURL;
      } else if (videoURL && !mobile) {
        const elements = await querySelectorAllPromise(
          "#actions.ytd-reel-player-overlay-renderer",
          20,
          100
        );
        for (const element of elements) {
          if (element.parentNode?.querySelector(
            ".youtube-shorts-block"
          ) == null) {
            element.insertAdjacentHTML(
              "afterbegin",
              `<div id="block" class="youtube-shorts-block" title="${chrome.i18n.getMessage("ui_openIn_title")}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
                        </svg>
                        ${chrome.i18n.getMessage("ui_openIn_view")}
                        </div>`
            );
            element.parentNode?.querySelector("#block")?.addEventListener("click", () => {
              document.querySelectorAll("video").forEach((e) => {
                e.pause();
              });
              window.open(
                _Extension.convertToVideoURL(location.href)
              );
            });
          }
        }
      }
    }
    async loadConfig() {
      const storage = await chrome.storage.local.get(null);
      if (typeof storage.isEnable === "boolean") {
        config.enable = storage.isEnable;
      }
      if (typeof storage.isHideVideos === "boolean") {
        config.hideShorts = storage.isHideVideos;
      } else {
        logf(
          `"Hide shorts video" is enabled by default!
If you don't want to do that, please disable in option page!`
        );
      }
      if (typeof storage.isHideTabs === "boolean") {
        config.hideTabs = storage.isHideTabs;
      }
      this.setObserve(config.enable && config.hideShorts);
      const extensionClass = "youtube-shorts-block";
      if (config.hideTabs) {
        document.body.classList.add(extensionClass);
      } else {
        document.body.classList.remove(extensionClass);
      }
    }
    async setObserve(isObserve) {
      if (isObserve) {
        if (this.observer !== null) return;
        const container = await querySelectorPromise("#content, #app");
        if (!container) {
          logf(
            "cannot find rootElement. currently, HideShorts isn't working!",
            "error"
          );
          return;
        }
        this.observer = new MutationObserver(() => this.domChanged());
        this.observer.observe(container, {
          childList: true,
          subtree: true
        });
        this.domChanged();
      } else {
        if (this.observer === null) return;
        this.observer.disconnect();
        this.observer = null;
      }
    }
    domChanged() {
      for (const filter of this.filterList) {
        filter();
      }
    }
    static convertToVideoURL(url) {
      const result = url.match(/shorts\/(.{11})\/?/);
      if (result) {
        return `https://www.youtube.com/watch?v=${result[1]}`;
      }
    }
  };
  var extension = new Extension();
})();
