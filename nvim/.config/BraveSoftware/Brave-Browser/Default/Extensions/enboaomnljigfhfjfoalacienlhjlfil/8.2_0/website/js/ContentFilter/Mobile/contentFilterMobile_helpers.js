// MARK: -

function setToStorage(name, value, callback) {
  browser.storage.local.set({ [name]: value }, callback);
}

function getPostID(element) {
  const link = element.querySelector("a[href*='post/']");

  return link ? extractPostID(link.getAttribute("href")) : null;
}

function getCommentID(element) {
  const link = element.querySelector("a[href*='lc=']");

  return link ? extractCommentID(link.getAttribute("href")) : null;
}

function getVideoID(element) {
  const link = element.querySelector("a[href*='watch?v='], a[href*='shorts']");

  if (link) {
    return link ? extractVideoId(link.getAttribute("href")) : null;
  } else {
    // Special for video page
    return element.getAttribute("video-id") ?? null;
  }
}

function getChannelID(element) {
  const link = element.querySelector("a[href*='/@'], a[href*='/channel']");

  return link ? extractChannelId(link.getAttribute("href")) : null;
}

function getChannelName(element) {
  const nameContainer =
    element.querySelector(".ytm-badge-and-byline-item-byline > span") ||
    element.querySelector(
      ".compact-media-item-byline > .yt-core-attributed-string"
    );

  if (nameContainer) {
    const title = nameContainer.innerHTML;

    return title == "" ? null : title;
  } else {
    return null;
  }
}

const BUTTON_TITLES = {
  video: "Block Video",
  channel: "Block Channel",
  comment: "Block Comment",
  post: "Block Post",
};

const BLOCK_STORAGE_CONSTANTS = {
  video: getConst.filterVideosRulesData,
  channel: getConst.filterChannelsRulesData,
  comment: getConst.filterCommentsRulesData,
  post: getConst.filterPostsRulesData,
};

// MARK: -

// Function to check if the link contains any keyword from the arrays
function linkContainsKeyword(link, keywordsArray) {
  return keywordsArray.some((keyword) => link.includes(keyword));
}

function findAncestor(element, selectors) {
  // Base case: If there are no more selectors or the element has no parent, return null
  if (!element || !element.parentElement || selectors.length === 0) {
    return null;
  }

  // Check if the current parent element matches any of the selectors
  if (selectors.includes(element.parentElement.tagName.toLowerCase())) {
    return element.parentElement;
  }

  // Recursive call to find the ancestor in the parent element
  return findAncestor(element.parentElement, selectors);
}

const contentTags = [
  "ytm-rich-item-renderer",
  "ytm-reel-item-renderer",
  "ytm-video-with-context-renderer", // search, related
  "ytm-video-card-renderer", // channel page for you
  "ytm-compact-video-renderer",
  "ytm-comment-thread-renderer",
  "ytm-comment-renderer",
  "ytm-universal-watch-card-renderer",
  "ytm-compact-channel-renderer",
  "ytm-compact-radio-renderer",
  "ytm-compact-playlist-renderer", // Playlist
]; // Playlist / Mixes
