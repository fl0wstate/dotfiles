// Redirect Shorts

function safe_redirectShorts() {
  const newUrl = location.href.replace("shorts", "watch");
  window.location.replace(newUrl);
}

// MARK: - Entry Point

function shortsPageIsOpened() {
  browser.storage.local.get(
    ["untrap_redirect_shorts_to_exclude_player"],
    function (obj) {
      // Redirect Shorts
      if (obj["untrap_redirect_shorts_to_exclude_player"] == true) {
        safe_redirectShorts();
      }
    }
  );
}
