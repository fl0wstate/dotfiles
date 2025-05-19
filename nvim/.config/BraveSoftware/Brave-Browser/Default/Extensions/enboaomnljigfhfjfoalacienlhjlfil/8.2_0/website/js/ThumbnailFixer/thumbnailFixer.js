var thumbType = "hqdefault";

function replaceThumb(img) {
  if (
    img.src.match(
      "https://i.ytimg.com/(vi|vi_webp)/.*/(hq1|hq2|hq3|hqdefault|mqdefault|sddefault|hq720)(_custom_[0-9]+)?.jpg?.*"
    )
  ) {
    const oldSRC = img.src;

    img.src = "";

    let url = oldSRC.replace(
      /(hq1|hq2|hq3|hqdefault|mqdefault|sddefault|hq720)(_custom_[0-9]+)?.jpg/,
      `${thumbType}.jpg`
    );

    if (!url.match(".*cachestring")) {
      url += "?cachestring";
    }

    img.classList.add("thumbReplaced");
    img.src = url;
  }
}

function startThumbnailReplacingDesktop() {
  document.addEventListener("image-loaded", (e) => {
    if (!e.target.classList.contains("thumbReplaced")) {
      replaceThumb(e.target);
    }
  });
}

function startThumbnailReplacingMobile() {
  function replaceMobileThumbnails(summaries) {
    for (const img of summaries[0].added) {
      if (!img.classList.contains("thumbReplaced")) {
        replaceThumb(img);
      }
    }
  }

  var imgObserver = new MutationSummary({
    callback: replaceMobileThumbnails,
    queries: [
      {
        element: "img.video-thumbnail-img[src]",
      },
    ],
  });
}

function startThumbnailReplacing() {
  const currentHref = window.location.href;

  if (isDesktop(currentHref)) {
    startThumbnailReplacingDesktop();
  } else {
    startThumbnailReplacingMobile();
  }
}

function triggerThumbnailUpdate() {
  const allThumbImages = document.querySelectorAll(
    "#thumbnail, yt-thumbnail-view-model, img.video-thumbnail-img"
  );

  for (const thumbnail of allThumbImages) {
    const img = thumbnail.querySelector("img");

    if (img) {
      replaceThumb(img);
    } else if (thumbnail.hasAttribute("src")) {
      replaceThumb(thumbnail);
    }
  }
}

browser.storage.local.get(
  [
    getConstNotSyncing.extensionIsEnabledData,
    "untrap_video_card_replace_thumbnail",
  ],
  function (obj) {
    const extensionIsEnabled =
      obj[getConstNotSyncing.extensionIsEnabledData] ?? true;
    const replaceType =
      obj["untrap_video_card_replace_thumbnail"] ?? "hqdefault";
    thumbType = replaceType;

    if (extensionIsEnabled == true && replaceType != "hqdefault") {
      startThumbnailReplacing();
    }
  }
);
