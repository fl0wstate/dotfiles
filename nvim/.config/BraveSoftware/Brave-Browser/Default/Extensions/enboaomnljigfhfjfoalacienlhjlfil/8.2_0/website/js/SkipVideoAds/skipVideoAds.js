const videoAdsConfig = {
  childList: true,
  subtree: true,
};

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "skipYoutubeVideoAds") {
    const isSkipVideoAds = message.isSkipVideoAds;

    if (isSkipVideoAds) {
      videoAdsObserver.observe(document.body, videoAdsConfig);
    } else {
      videoAdsObserver.disconnect();
    }
  }
});

const videoAdsObserver = new MutationObserver(() => {
  const videoContainer = document.querySelector(".html5-video-player");

  if (videoContainer) {
    hideVideoAdsHandler(videoContainer);
  }
});

function hideVideoAdsHandler(videoContainer) {
  if (videoContainer.classList.contains("ad-showing")) {
    const youtubeVideo = videoContainer.querySelector("video");
    const youtubeVideoDuration = youtubeVideo.duration;

    videoContainer.style.display = "none";

    const skipButton = document.querySelector(
      "button.ytp-ad-skip-button, button.ytp-ad-skip-button-modern, button.ytp-skip-ad-button"
    );

    if (youtubeVideoDuration && typeof youtubeVideoDuration === "number") {
      youtubeVideo.currentTime = youtubeVideoDuration;
    }

    if (skipButton) {
      skipVideoAdsWithButton(skipButton);
    }
  } else {
    videoContainer.style.display = "block";
  }
}

function skipVideoAdsWithButton(skipButton) {
  const skipButtonText = skipButton.querySelector(
    "div.ytp-ad-skip-button-text"
  );

  if (skipButtonText !== null && skipButtonText.style.display !== "none") {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    skipButtonText.dispatchEvent(clickEvent);
  } else {
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    skipButton.dispatchEvent(clickEvent);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const hideVideoAdsAttribute = document.documentElement.getAttribute(
    "untrap_global_skip_video_ads"
  );

  if (hideVideoAdsAttribute === "true") {
    videoAdsObserver.observe(document.body, videoAdsConfig);
  } else {
    videoAdsObserver.disconnect();
  }
});
