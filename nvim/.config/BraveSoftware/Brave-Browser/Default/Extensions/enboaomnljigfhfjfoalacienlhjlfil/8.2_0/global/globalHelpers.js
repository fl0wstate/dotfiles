// MARK: - Specify Browser

var browser = browser || chrome;

// MARK: - System Design Methods

function queryById(name) {
  return document.getElementById(name);
}

function querySelector(selector) {
  return document.querySelector(selector);
}

function querySelectorAll(selector) {
  return document.querySelectorAll(selector);
}

// MARK: - Popup helpers

function addZeroPrefix(number) {
  return ("0" + number).slice(-2);
}

function addSeconds(date, seconds) {
  date.setTime(date.getTime() + seconds * 1000);

  return date;
}

// Extract content links

function extractChannelId(url) {
  if (url.includes("@")) {
    // Case 1 @username
    const match = url.match(/@([^/?]+)/);
    return match ? match[1] : null;
  } else if (url.includes("/channel/")) {
    // Case 2 channel/UC6rwiIxv0w2fbmmr66wl1rA
    const match = url.match(/channel\/([^/?]+)/);
    return match ? match[1] : null;
  } else {
    // Not a valid YouTube channel link
    return null;
  }
}

function extractVideoId(url) {
  if (url.includes("/watch?v=")) {
    // Case 1 watch?v=-CoIUNSsl04
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  } else if (url.includes("/shorts/")) {
    // Case 2 shorts/dol2GgVE5Vs
    const match = url.match(/shorts\/([^/?]+)/);
    return match ? match[1] : null;
  } else {
    // Not a valid YouTube video link
    return null;
  }
}

function extractCommentID(link) {
  const match = link.match(/[?&]lc=([^&]+)/);
  return match ? match[1] : null;
}

function extractPostID(link) {
  const match = link.match(/\/post\/([^\/]+)/);
  return match ? match[1] : null;
}

function getSecondsFromMinutes(seconds) {
  const SECONDS_IN_MINUTE = 60;

  return Number(seconds * SECONDS_IN_MINUTE);
}

// MARK: - Page Constants

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const homePageUrlPartDesktop = "https://www.youtube.com/";
const homePageUrlPartMobile = "https://m.youtube.com/";

const searchPageUrlPart = "youtube.com/results";
const videoPageUrlPart = "youtube.com/watch";
const subscriptionsPageUrlPart = "youtube.com/feed/subscriptions";

const channelPageUrlPart1 = "youtube.com/@";
const channelPageUrlPart2 = "youtube.com/channel";

const shortsPageUrlPart = "youtube.com/shorts/";

const youPageUrlPart1 = "youtube.com/feed/you";
const youPageUrlPart2 = "youtube.com/feed/library";
