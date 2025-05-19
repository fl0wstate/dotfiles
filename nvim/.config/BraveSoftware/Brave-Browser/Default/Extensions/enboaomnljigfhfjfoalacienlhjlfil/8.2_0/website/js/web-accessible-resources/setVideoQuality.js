(function () {
  const qualityLevels = [
    "highres",
    "hd2160",
    "hd1440",
    "hd1080",
    "hd720",
    "large",
    "medium",
    "small",
    "tiny",
  ];

  function setYoutubeVideoQuality(videoQuality) {
    const player = document.getElementById("movie_player");
    if (player && typeof player.getAvailableQualityLevels === "function") {
      const availableQualities = player.getAvailableQualityLevels();

      const lowest = availableQualities[availableQualities.length - 2];

      const highest = availableQualities[0];

      const closestQuality = findClosestQuality(
        availableQualities,
        videoQuality
      );

      if (closestQuality) {
        player.setPlaybackQualityRange(closestQuality, closestQuality);
      } else if (videoQuality === "lowest") {
        player.setPlaybackQualityRange(lowest, lowest);
      } else if (videoQuality === "highest") {
        player.setPlaybackQualityRange(highest, highest);
      } else {
        player.setPlaybackQualityRange("auto", "auto");
      }
    }
  }

  function findClosestQuality(availableQualities, desiredQuality) {
    const desiredIndex = qualityLevels.indexOf(desiredQuality);
    if (desiredIndex === -1) return null;

    for (let i = desiredIndex; i >= 0; i--) {
      if (availableQualities.includes(qualityLevels[i])) {
        return qualityLevels[i];
      }
    }

    return availableQualities[0];
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) {
      return;
    }

    if (event.data.type === "SET_VIDEO_QUALITY") {
      setYoutubeVideoQuality(event.data.videoQuality);
    }
  });

  function qualityListener() {
    const videoQualityAttr = document.documentElement.getAttribute(
      "untrap_global_video_quality"
    );

    if (typeof videoQualityAttr === "string") {
      setYoutubeVideoQuality(videoQualityAttr);
    }
  }

  window.addEventListener("load", () => {
    qualityListener();
  });

  // window.addEventListener("loadeddata", qualityListener, true);
  // qualityListener();
})();
