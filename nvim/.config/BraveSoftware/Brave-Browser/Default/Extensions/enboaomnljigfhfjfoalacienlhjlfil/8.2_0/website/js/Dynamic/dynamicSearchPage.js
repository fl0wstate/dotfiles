function safe_sort_by(sortBy) {
  var currentUrl = window.location.href;

  if (isSearchDefaultUrl(currentUrl)) {
    if (sortBy == "uploadDate") {
      window.location.replace(currentUrl + "&sp=CAI");
    } else if (sortBy == "viewCount") {
      window.location.replace(currentUrl + "&sp=CAM");
    } else if (sortBy == "rating") {
      window.location.replace(currentUrl + "&sp=CAE");
    }
  }
}

function isSearchDefaultUrl(url) {
  const youtubeSearchRegex =
    /^https?:\/\/(www|m)\.youtube\.com\/results\?search_query=[^&]+$/;

  return youtubeSearchRegex.test(url);
}

// MARK: - Enter Point

function searchPageIsOpened() {
  browser.storage.local.get(["untrap_search_page_sort_by"], function (obj) {
    const sort_by = obj["untrap_search_page_sort_by"];

    if (sort_by != "relevance" && sort_by != null) {
      safe_sort_by(sort_by);
    }
  });
}
