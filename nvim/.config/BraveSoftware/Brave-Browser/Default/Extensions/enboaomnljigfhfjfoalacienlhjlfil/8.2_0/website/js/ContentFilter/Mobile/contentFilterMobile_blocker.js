function includesStringOrRegex(element, longString) {
  // Try to find in text
  if (longString.includes(element)) {
    return true;
  }

  // Try to find through regex
  const regex = new RegExp(element, "i");

  return regex.test(longString);
}

// MARK: - Content Blocker
// Functions will check content and try to block

function filterElement(element, rules) {
  const itemTextContent = element.textContent;

  // Loop through rules

  for (const rule of rules) {
    const lowercasedRule = rule.toLowerCase();
    const escapedRule = lowercasedRule.replace(/[."*+?^${}()|[\]\\]/g, "\\$&");

    // Check visible text content for keys

    if (includesStringOrRegex(escapedRule, itemTextContent)) {
      element.style.display = "none";
      return;
    }

    // Check dom attributes for key

    const includesAttr = element.querySelectorAll(
      'a[href*="' + escapedRule + '" i], [aria-label*="' + escapedRule + '" i]'
    );

    if (includesAttr.length > 0) {
      element.style.display = "none";
    }
  }
}

function filterYouTubeContent() {
  browser.storage.local.get(
    [
      getConst.filterChannelsRulesData,
      getConst.filterVideosRulesData,
      getConst.filterCommentsRulesData,
      getConst.filterPostsRulesData,
    ],
    function (obj) {
      // Get filter lists
      const channelsRules = obj[getConst.filterChannelsRulesData] ?? [];
      const videosRules = obj[getConst.filterVideosRulesData] ?? [];
      const commentsRules = obj[getConst.filterCommentsRulesData] ?? [];
      const postsRules = obj[getConst.filterPostsRulesData] ?? [];

      const mergedCardRules = [...videosRules, ...channelsRules];
      const mergedCommentRules = [...commentsRules, ...channelsRules];
      const mergedPostRules = [...postsRules, ...channelsRules];

      // Select content elements
      const selector = contentTags
        .map((tag) => `${tag}:not([filterChecked])`)
        .join(", ");
      const contentElements = document.querySelectorAll(selector);

      for (const element of contentElements) {
        if (
          element.querySelector("a[href*='watch?v']") ||
          element.querySelector("a[href*='shorts/']") ||
          element.querySelector("a[href*='playlist?list']") ||
          element.tagName.toLowerCase() === "ytm-compact-channel-renderer"
        ) {
          if (mergedCardRules.length > 0) {
            filterElement(element, mergedCardRules);
            element.setAttribute("filterChecked", "");
          }
        } else if (element.querySelector(".comment-content")) {
          if (mergedCommentRules.length > 0) {
            filterElement(element, mergedCommentRules);
            element.setAttribute("filterChecked", "");
          }
        }
      }
    }
  );
}

// MARK: - Content Changes Observer
// It need to trigger when specific elements is appearing or loading new to recheck if need block them

browser.storage.local.get(
  [getConstNotSyncing.extensionIsEnabledData, getConst.filterIsEnabledData],
  function (obj) {
    const extensionIsEnabled =
      obj[getConstNotSyncing.extensionIsEnabledData] ?? true;
    const filterIsEnabled = obj[getConst.filterIsEnabledData] ?? false;

    if (extensionIsEnabled == true && filterIsEnabled == true) {
      const queries = contentTags.map((tag) => ({
        element: `${tag}`,
      }));

      var filterObserver = new MutationSummary({
        callback: filterYouTubeContent,
        queries: queries,
      });
    }
  }
);
