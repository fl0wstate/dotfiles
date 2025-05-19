// Redirect Home To

function safe_redirectHomeTo(redirectValue) {
  if (location.href.includes("www.youtube.com")) {
    if (redirectValue == "subscriptions") {
      window.location.replace("https://www.youtube.com/feed/subscriptions");
    } else if (redirectValue == "trending") {
      window.location.replace("https://www.youtube.com/feed/trending");
    } else if (redirectValue == "history") {
      window.location.replace("https://www.youtube.com/feed/history");
    } else if (redirectValue == "watch_later") {
      window.location.replace("https://www.youtube.com/playlist?list=WL");
    } else if (redirectValue == "liked") {
      window.location.replace("https://www.youtube.com/playlist?list=LL");
    } else if (redirectValue == "library") {
      window.location.replace("https://www.youtube.com/feed/library");
    }
  } else if (location.href.includes("m.youtube.com")) {
    if (redirectValue == "subscriptions") {
      window.location.replace("https://m.youtube.com/feed/subscriptions");
    } else if (redirectValue == "trending") {
      window.location.replace("https://m.youtube.com/feed/trending");
    } else if (redirectValue == "history") {
      window.location.replace("https://m.youtube.com/feed/history");
    } else if (redirectValue == "watch_later") {
      window.location.replace("https://m.youtube.com/playlist?list=WL");
    } else if (redirectValue == "liked") {
      window.location.replace("https://www.youtube.com/playlist?list=LL");
    } else if (redirectValue == "library") {
      window.location.replace("https://m.youtube.com/feed/library");
    }
  }
}

// MARK: - Entry Point

function homePageIsOpened() {
  browser.storage.local.get(["untrap_redirect_home_to"], function (obj) {
    // Redirect Home To
    const redirect_home_to = obj["untrap_redirect_home_to"] ?? "home";
    if (redirect_home_to != "home" && redirect_home_to != "search") {
      safe_redirectHomeTo(redirect_home_to);
    }
  });
}
