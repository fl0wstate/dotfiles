// MARK: - Thumbnail Filters Values

const blurValues = [
  "0",
  "1.25px",
  "2.25px",
  "3px",
  "4.125px",
  "5.625px",
  "7.6875px",
  "10.5px",
  "14.34375px",
  "19.59375px",
  "26.765625px",
  "40.1484375px",
];
const grayscaleValues = [
  "0",
  "0.1",
  "0.2",
  "0.3",
  "0.4",
  "0.5",
  "0.6",
  "0.7",
  "0.8",
  "0.9",
  "1",
];
const opacityValues = [
  "1",
  "0.9",
  "0.8",
  "0.7",
  "0.6",
  "0.5",
  "0.4",
  "0.3",
  "0.2",
  "0.1",
  "0",
];

// MARK: - Thumbnail Filters Ids

const blurFilterId = "untrap_video_card_blur_thumbnail";
const grayscaleFilterId = "untrap_video_card_grayscale_thumbnail";
const opacityFilterId = "untrap_video_card_opacity_thumbnail";

// MARK: - On Page Loading

function setThumbnailFilters() {
  // Generate new filter styles
  browser.storage.local.get(
    [blurFilterId, grayscaleFilterId, opacityFilterId],
    function (obj) {
      // Rename old filter to delete
      if (queryById("thumbnailFilterStyles")) {
        queryById("thumbnailFilterStyles").id = "thumbnailFilterStyles_old";
      }

      // Get Indexes

      const blurValueIndex = obj[blurFilterId] ?? 0;
      const grayscaleValueIndex = obj[grayscaleFilterId] ?? 0;
      const opacityValueIndex = obj[opacityFilterId] ?? 0;

      // Get Values by Indexes

      const blurValue = blurValues[blurValueIndex];
      const grayscaleValue = grayscaleValues[grayscaleValueIndex];
      const opacityValue = opacityValues[opacityValueIndex];

      // Create a style element

      const styleElement = document.createElement("style");
      styleElement.id = "thumbnailFilterStyles";

      // Set the style content with dynamic CSS rules

      styleElement.textContent = `
            
            html[untrap_is_desktop="true"][untrap_global_enable="true"] yt-thumbnail-view-model img,
            html[untrap_is_desktop="true"][untrap_global_enable="true"] #thumbnail img {
            
                filter: opacity(${opacityValue}) grayscale(${grayscaleValue}) blur(${blurValue}) !important;
            
            }
            
            
            html[untrap_is_mobile="true"][untrap_global_enable="true"] .video-thumbnail-img,
            
            html[untrap_is_mobile="true"][untrap_global_enable="true"] ytm-shorts-lockup-view-model img {
            
                filter: opacity(${opacityValue}) grayscale(${grayscaleValue}) blur(${blurValue}) !important;
            
            }`;

      // Append the style element to the document's head

      document.head.appendChild(styleElement);

      // Remove old styles

      if (queryById("thumbnailFilterStyles_old")) {
        queryById("thumbnailFilterStyles_old").remove();
      }
    }
  );
}

setThumbnailFilters();
