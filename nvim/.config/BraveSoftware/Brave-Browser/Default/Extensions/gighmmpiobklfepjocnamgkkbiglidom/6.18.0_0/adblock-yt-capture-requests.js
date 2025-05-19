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
/* global DOMPurify */

/*
The code in this file is injected into the world context when a user navigates to youtube.com.

It performs the following actions:
  1.a) listen for event messages from content script (update URL with channel name)
  1.b) send event messages (channel name, video id) to content script
  1.c) wrap fetch to capture the channel name in the JSON response (for '/watch' URLs only)
  1.d) when the channel name is found in (1.c) above,
  1.d.1) send a event message to the content script (1.b above)
  1.d.2) parse the channel name, and update the pages URL
*/

const parseChannelName = function (channelNameToParse) {
  // used to decode all encoded HTML (convert '&' to &amp;)
  const parseElem = document.createElement("textarea");

  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
  }

  parseElem.innerHTML = DOMPurify.sanitize(channelNameToParse, { RETURN_TRUSTED_TYPE: true });
  const channelName = parseElem.innerText;
  // Remove whitespace, and encode
  return fixedEncodeURIComponent(channelName.replace(/\s/g, ""));
};

const updateURLWrapped = function (channelName) {
  if (window.location.pathname !== "/watch") {
    return;
  }
  if (channelName) {
    const parsedChannelName = parseChannelName(channelName);
    const currentLocation = new URL(window.location.href);
    let updatedUrl;

    let [baseUrl] = window.location.href.split("&ab_channel");
    [baseUrl] = baseUrl.split("?ab_channel");

    if (currentLocation.search) {
      updatedUrl = `${baseUrl}&ab_channel=${parsedChannelName}`;
    } else {
      updatedUrl = `${baseUrl}?&ab_channel=${parsedChannelName}`;
    }

    // Add the name of the channel to the end of URL
    window.history.replaceState(null, null, updatedUrl);
  }
};

const postRequestCheck = function (response, toContentScriptEventName) {
  if (
    response &&
    response.url &&
    response.url.startsWith("https://www.youtube.com/youtubei/v1/player")
  ) {
    response
      .clone()
      .json()
      .then((respObj) => {
        if (respObj && respObj.videoDetails) {
          const { author, videoId } = respObj.videoDetails;
          updateURLWrapped(author);
          window.postMessage(
            {
              eventName: toContentScriptEventName,
              channelName: String(author),
              videoId,
            },
            "*",
          );
        }
      });
  }
};

const wrapFetch = function (toContentScriptEventName) {
  const myFetch = window.fetch;
  window.fetch = function theFetch(...args) {
    return new Promise((resolve, reject) => {
      myFetch
        .apply(this, args)
        .then((response) => {
          postRequestCheck(response, toContentScriptEventName);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

const addContentScriptListeners = function (toContentScriptEventName, fromContentScriptEventName) {
  window.addEventListener("message", (event) => {
    if (!event || !event.data) {
      return;
    }

    if (
      event.data.channelName &&
      (event.data.eventName === fromContentScriptEventName ||
        event.data.eventName === toContentScriptEventName)
    ) {
      updateURLWrapped(event.data.channelName);
    }

    if (event.data.removeChannelName && event.data.eventName === fromContentScriptEventName) {
      // remove the query string from the URL

      const currentURL = new URL(window.location.href);
      currentURL.searchParams.delete("ab_channel");
      const queryString = currentURL.searchParams.toString();

      window.history.replaceState(
        null,
        null,
        `${window.location.origin}${window.location.pathname}?${queryString}`,
      );
    }
  });
};

const addYtListeners = function (toContentScriptEventName) {
  document.addEventListener("yt-navigate-finish", (event) => {
    if (
      event &&
      event.detail &&
      event.detail.response &&
      event.detail.response.playerResponse &&
      event.detail.response.playerResponse.videoDetails &&
      event.detail.response.playerResponse.videoDetails.author
    ) {
      const { author, videoId } = event.detail.response.playerResponse.videoDetails;
      updateURLWrapped(author);
      window.postMessage(
        {
          eventName: toContentScriptEventName,
          channelName: String(author),
          videoId,
        },
        "*",
      );
    }
  });
};

const captureRequests = function ({ toContentScriptEventName, fromContentScriptEventName }) {
  wrapFetch(toContentScriptEventName);
  addYtListeners(toContentScriptEventName);
  addContentScriptListeners(toContentScriptEventName, fromContentScriptEventName);
};

const initWithParams = function () {
  try {
    const { params } = document.querySelector('script[data-name="capture-requests"]').dataset;
    captureRequests(JSON.parse(params));
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
  }
};

const start = function () {
  initWithParams();
};

start();
