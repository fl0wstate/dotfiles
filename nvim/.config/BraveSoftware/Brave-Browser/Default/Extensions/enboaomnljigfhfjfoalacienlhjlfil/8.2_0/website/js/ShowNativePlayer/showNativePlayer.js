(function () {
  let videoPlayer = null;

  const videoControlsConfig = {
    attributes: true,
    attributeFilter: ["controls"],
  };

  const videoRenderConfig = {
    childList: true,
    subtree: true,
  };

  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "setNativeVideoPlayer") {
      const isShowNativeVideoPlayer = message.isShowNativeVideoPlayer;

      if (videoPlayer) {
        if (isShowNativeVideoPlayer) {
          videoPlayer.controls = true;
          videoControlsObserver.observe(videoPlayer, videoControlsConfig);
        } else {
          videoPlayer.controls = false;
          videoControlsObserver.disconnect();
        }
      }
    }
  });

  const videoRenderObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      const youtubeVideoPlayer = document.querySelector("video");

      if (youtubeVideoPlayer) {
        const isShowNativeVideoPlayer = document.documentElement.getAttribute(
          "untrap_global_show_native_video_player"
        );

        videoPlayer = youtubeVideoPlayer;

        if (isShowNativeVideoPlayer === "true") {
          videoPlayer.controls = true;
          videoControlsObserver.observe(videoPlayer, videoControlsConfig);
        }

        videoRenderObserver.disconnect();
      }
    });
  });

  videoRenderObserver.observe(document, videoRenderConfig);

  const videoControlsObserver = new MutationObserver((records) => {
    records.forEach((mutation) => {
      const video = mutation.target;

      if (video.controls !== true) {
        video.controls = true;
      }
    });
  });
})();
