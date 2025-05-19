(function () {
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "setYoutubeVideoQuality") {
      const videoQuality = message.videoQuality;

      window.postMessage({ type: "SET_VIDEO_QUALITY", videoQuality }, "*");
    }
  });

  function injectionChooseVideoQualityScript() {
    const script = document.createElement("script");
    script.src = browser.runtime.getURL(
      "website/js/web-accessible-resources/setVideoQuality.js"
    );

    document.body.appendChild(script);
  }

  window.addEventListener(
    "loadeddata",
    injectionChooseVideoQualityScript,
    true
  );
})();
