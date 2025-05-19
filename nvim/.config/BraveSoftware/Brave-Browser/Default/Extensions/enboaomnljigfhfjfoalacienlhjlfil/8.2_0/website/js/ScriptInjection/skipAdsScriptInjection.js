(function () {
  function injectionSkipAdsScript() {
    const script = document.createElement("script");
    script.src = browser.runtime.getURL(
      "website/js/web-accessible-resources/skipAdsOverrideClickEvent.js"
    );

    document.body.appendChild(script);
  }

  window.addEventListener("load", injectionSkipAdsScript, true);
})();
