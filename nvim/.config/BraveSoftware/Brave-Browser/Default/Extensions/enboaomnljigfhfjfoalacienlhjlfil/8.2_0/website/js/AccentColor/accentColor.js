// MARK: - Acent Color

function setAccentColor() {
  function removeOldAccentColor() {
    // Remove old styles

    if (queryById("accentColorStyles")) {
      queryById("accentColorStyles").remove();
    }
  }

  // Generate new filter styles

  browser.storage.local.get(["untrap_appearance_color"], function (obj) {
    const colorToSet = obj["untrap_appearance_color"] ?? "default";

    if (colorToSet != "default") {
      // Create a style element

      const styleElement = document.createElement("style");
      styleElement.id = "accentColorStyles";

      // Set the style content with dynamic CSS rules

      styleElement.textContent = `
                
                html {
                    --yt-spec-static-brand-red: ${colorToSet}!important;
                }

                [fill="#FF0000" i], [fill="#F00" i], [fill="red" i]  {
                    fill: ${colorToSet}!important;
                }

                .ytp-swatch-background-color {
                    background-color: ${colorToSet}!important;
                }
                
                .ytp-settings-button.ytp-hd-quality-badge:after, .ytp-settings-button.ytp-hdr-quality-badge:after, .ytp-settings-button.ytp-4k-quality-badge:after, .ytp-settings-button.ytp-5k-quality-badge:after, .ytp-settings-button.ytp-8k-quality-badge:after, .ytp-settings-button.ytp-3d-badge-grey:after, .ytp-settings-button.ytp-3d-badge:after, .ytp-chrome-controls .ytp-button[aria-pressed]:after {
                    background-color: ${colorToSet}!important;
                }
               
                .YtProgressBarPlayheadProgressBarPlayheadDot, .YtProgressBarLineProgressBarPlayed, .thumbnail-overlay-resume-playback-progress {
                    background-color: ${colorToSet}!important;
                }
               
               .YtmProgressBarProgressBarPlayheadDot, .YtmProgressBarProgressBarPlayed {
                    background-color: ${colorToSet}!important;
               }
               
               .mobile-topbar-logo svg path:nth-child(1) {
                   color: ${colorToSet}!important;
               }
               
               .YtmChapteredProgressBarChapteredPlayerBarFill, .YtmChapteredProgressBarChapteredPlayerBarChapter[style*="background-color: red;"] {
                    background: ${colorToSet}!important;
               }`;

      // Remove old styles

      removeOldAccentColor();

      // Append the style element to the document's head

      document.head.appendChild(styleElement);
    } else {
      removeOldAccentColor();
    }
  });
}

setAccentColor();

// MARK: - Primary Background Color

function setPrimaryBGColor() {
  function removeOldAccentColor() {
    // Remove old styles

    if (queryById("primaryBGColorStyles")) {
      queryById("primaryBGColorStyles").remove();
    }
  }

  // Generate new filter styles

  browser.storage.local.get(
    ["untrap_appearance_primary_bg_color"],
    function (obj) {
      const colorToSet = obj["untrap_appearance_primary_bg_color"] ?? "default";

      if (colorToSet != "default") {
        // Create a style element

        const styleElement = document.createElement("style");
        styleElement.id = "primaryBGColorStyles";

        // Set the style content with dynamic CSS rules

        styleElement.textContent = `
                
                html, html[dark], [dark] {
                    --yt-spec-base-background: ${colorToSet}!important;
                }
                
                ytm-app, ytm-pivot-bar-renderer, ytm-mobile-topbar-renderer, ytm-feed-filter-chip-bar-renderer {
                    background-color: ${colorToSet}!important;
                }
               `;

        // Remove old styles

        removeOldAccentColor();

        // Append the style element to the document's head

        document.head.appendChild(styleElement);
      } else {
        removeOldAccentColor();
      }
    }
  );
}

setPrimaryBGColor();

// MARK: - Secondary Background Color

function setSecondaryBGColor() {
  function removeOldAccentColor() {
    // Remove old styles

    if (queryById("accentColorStyles")) {
      queryById("accentColorStyles").remove();
    }
  }

  // Generate new filter styles

  browser.storage.local.get(["untrap_appearance_color"], function (obj) {
    const colorToSet = obj["untrap_appearance_color"] ?? "default";

    if (colorToSet != "default") {
      // Create a style element

      const styleElement = document.createElement("style");
      styleElement.id = "accentColorStyles";

      // Set the style content with dynamic CSS rules

      styleElement.textContent = `
                
                html {
                    --yt-spec-static-brand-red: ${colorToSet}!important;
                }

                [fill="#FF0000" i], [fill="#F00" i], [fill="red" i]  {
                    fill: ${colorToSet}!important;
                }

                .ytp-swatch-background-color {
                    background-color: ${colorToSet}!important;
                }
                
                .ytp-settings-button.ytp-hd-quality-badge:after, .ytp-settings-button.ytp-hdr-quality-badge:after, .ytp-settings-button.ytp-4k-quality-badge:after, .ytp-settings-button.ytp-5k-quality-badge:after, .ytp-settings-button.ytp-8k-quality-badge:after, .ytp-settings-button.ytp-3d-badge-grey:after, .ytp-settings-button.ytp-3d-badge:after, .ytp-chrome-controls .ytp-button[aria-pressed]:after {
                    background-color: ${colorToSet}!important;
                }

                .mobile-topbar-logo svg path:nth-child(1) {
                    color: ${colorToSet}!important;
                }
               
                .YtProgressBarPlayheadProgressBarPlayheadDot, .YtProgressBarLineProgressBarPlayed, .thumbnail-overlay-resume-playback-progress {
                    background-color: ${colorToSet}!important;
                }
               
               .YtmProgressBarProgressBarPlayheadDot, .YtmProgressBarProgressBarPlayed {
                    background-color: ${colorToSet}!important;
               }
               
               .YtmChapteredProgressBarChapteredPlayerBarFill, .YtmChapteredProgressBarChapteredPlayerBarChapter[style*="background-color: red;"] {
                    background: ${colorToSet}!important;
               }`;

      // Remove old styles

      removeOldAccentColor();

      // Append the style element to the document's head

      document.head.appendChild(styleElement);
    } else {
      removeOldAccentColor();
    }
  });
}

setSecondaryBGColor();
