/*
 * This file is part of AdBlock  <https://getadblock.com/>,
 * Copyright (C) 2013-present  Adblock, Inc.
 *
 * AdBlock is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * AdBlock is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdBlock.  If not, see <http://www.gnu.org/licenses/>.
 */

/* For ESLint: List any global identifiers used in this file below */
/* global browser, setLangAndDirAttributes, sessionStorageGet, sessionStorageSet, translate */

const CLOSED_KEY = "closedProgrammatically";
const PAGE_INFO_KEY = "pageInfo";
const COOKIE_FILTER_KEY = "cookies-premium";
const DISTRACTIONS_KEY = "distraction-control";

const addLanguageAndDir = () => {
  if (document.readyState === "complete" && typeof setLangAndDirAttributes === "function") {
    setLangAndDirAttributes();
  }
};

const addUserIdToUrl = async function (url) {
  const userID = await browser.runtime.sendMessage({ command: "getUserId" });
  const urlToOpen = new URL(url);
  urlToOpen.searchParams.append("u", userID);
  return urlToOpen.href;
};

const closePopup = function () {
  sessionStorageSet(CLOSED_KEY, true);
  window.close();
};

const getTabId = function () {
  let tabId;
  if (document.location.search && document.location.search.indexOf("tabId") > 0) {
    const params = new URLSearchParams(document.location.search);
    tabId = params.get("tabId");
    if (tabId === "error") {
      // allows testing of the error handling logic
      throw new Error("anError");
    }
  }
  return tabId;
};

const navigateTo = (url) => {
  window.location = url;
};

const reportClose = () => {
  const programaticallyClosed = sessionStorageGet(CLOSED_KEY);
  if (!programaticallyClosed) {
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "popup_closed" });
  }
};

const setupBehaviorListeners = () => {
  window.addEventListener("unload", reportClose);
  document.addEventListener("readystatechange", addLanguageAndDir);
};

const returnToIndex = function () {
  window.location.assign("adblock-button-popup.html");
};

const sendMessageWithNoResponse = function (message) {
  void browser.runtime.sendMessage(message);
};

// This exists becuase we translate paragraphs sentence-by-sentence
// but with web-components, we cannot pass an array and we want to populate
// in the HTML itself
const splitAndTranslate = (i18n) => {
  const shouldSplit = i18n.includes("|");

  if (!shouldSplit) {
    return translate(i18n);
  }

  return i18n.split("|").map(translate).join(" ");
};

const translatePageTitle = () => {
  const title = document.querySelector("title");
  const { i18n } = title.dataset;
  const translatedTitle = translate(i18n);

  title.textContent = translatedTitle;
};

// Use when a styling element or link needs to be interpolated into a translation string.
// Currently not recursive.
const translateWithTags = (messageID, innerText, [openingTag, closingTag]) => {
  const rawMessage = translate(messageID, innerText);
  const replacedMessage = rawMessage.replace("[[", openingTag).replace("]]", closingTag);
  return replacedMessage;
};

export {
  CLOSED_KEY,
  COOKIE_FILTER_KEY,
  DISTRACTIONS_KEY,
  PAGE_INFO_KEY,
  addUserIdToUrl,
  closePopup,
  navigateTo,
  getTabId,
  returnToIndex,
  sendMessageWithNoResponse,
  setupBehaviorListeners,
  splitAndTranslate,
  translatePageTitle,
  translateWithTags,
};
