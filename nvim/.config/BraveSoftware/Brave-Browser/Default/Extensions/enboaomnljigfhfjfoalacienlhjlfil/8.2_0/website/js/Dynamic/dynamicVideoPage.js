function safe_autoExpandVideoDescription() {
  const observer = new MutationObserver(function (mutations) {
    const expandButton = document.querySelector(
      "tp-yt-paper-button#expand:not([hidden])"
    );

    var clicked = false;

    if (expandButton) {
      expandButton.click();
      clicked = true;
    }

    if (clicked) {
      setTimeout(function () {
        observer.disconnect();
      }, 2000);
    }
  });

  // Start observing changes in the DOM
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
  });
}

function safe_autoTheaterMode() {
  const observer = new MutationObserver(function (mutations) {
    const theaterButton = document.querySelector(
      "ytd-watch-flexy:not([theater]) .ytp-size-button"
    );

    var clicked = false;

    if (theaterButton) {
      theaterButton.click();
      clicked = true;
    }

    if (clicked) {
      setTimeout(function () {
        observer.disconnect();
      }, 2000);
    }
  });

  // Check if already not a Theater Mode
  const theaterIsRun = document.querySelector("ytd-watch-flexy:not([theater])");

  if (theaterIsRun) {
    // Start observing changes in the DOM
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  }
}

function safe_autoDisableAutoplay() {
  var interval = setInterval(function () {
    const autoplayButton = document.querySelector(
      ".ytp-button[data-tooltip-target-id='ytp-autonav-toggle-button']:has(.ytp-autonav-toggle-button[aria-checked='true'])"
    );

    var clicked = false;

    if (autoplayButton) {
      autoplayButton.click();
    }

    const offedAutoplayButton = document.querySelector(
      ".ytp-button[data-tooltip-target-id='ytp-autonav-toggle-button']:has(.ytp-autonav-toggle-button[aria-checked='false'])"
    );

    if (offedAutoplayButton) {
      clearInterval(interval);
    }
  }, 1000);
}

function safe_autoShowsChaptersInSidebar() {
  document
    .querySelector("html")
    .setAttribute("untrap_video_page_chapters_in_sidebar_closed_by_user", true);

  setTimeout(chapterCloseButtonHandler, 1000);

  function chapterCloseButtonHandler() {
    const chaptersContainer = document.querySelector(
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]'
    );

    if (chaptersContainer) {
      chaptersContainer.addEventListener("click", (event) => {
        const button = event.target.closest("button");

        if (button && button.closest("#visibility-button")) {
          alertTriggered = true;
          clicked = true;

          document
            .querySelector("html")
            .setAttribute(
              "untrap_video_page_chapters_in_sidebar_closed_by_user",
              false
            );
        }
      });
    }
  }

  const observer = new MutationObserver(function (mutations) {
    const updatedChaptersContainer = document.querySelector(
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-macro-markers-description-chapters"]'
    );

    if (!updatedChaptersContainer) {
      observer.disconnect();
      return;
    }
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
  });
}

// MARK: - Enter Point

function videoPageIsOpened() {
  browser.storage.local.get(
    [
      "untrap_video_page_auto_theater_mode",
      "untrap_video_page_auto_expand_description",
      "untrap_video_page_disable_autoplay",
      "untrap_video_page_auto_shows_chapters_in_sidebar",
    ],
    function (obj) {
      // Auto Theater Mode
      const auto_theater = obj["untrap_video_page_auto_theater_mode"];
      if (auto_theater == true) {
        safe_autoTheaterMode();
      }

      // Auto Expand Description
      const expand_description =
        obj["untrap_video_page_auto_expand_description"];
      if (expand_description == true) {
        safe_autoExpandVideoDescription();
      }

      // Observe click in chapters container
      const show_chapters =
        obj["untrap_video_page_auto_shows_chapters_in_sidebar"];
      if (show_chapters == true) {
        safe_autoShowsChaptersInSidebar();
      }

      // Disable Autoplay
      const disable_autoplay = obj["untrap_video_page_disable_autoplay"];
      if (disable_autoplay == true) {
        safe_autoDisableAutoplay();
      }
    }
  );
}
