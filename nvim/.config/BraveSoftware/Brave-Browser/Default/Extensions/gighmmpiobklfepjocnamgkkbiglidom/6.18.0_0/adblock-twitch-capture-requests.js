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
The code in this file is injected into the world context when a user navigates to Twitch.tv

It performs the following actions:
  1.a) listen for event messages from content script (update URL with channel name)
  1.b) send event messages (channel name) to content script
  1.c) wrap fetch to capture the channel name in the JSON request or response
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

  parseElem.innerHTML = DOMPurify.sanitize(channelNameToParse);
  const channelName = parseElem.innerText;
  // Remove whitespace, and encode
  return fixedEncodeURIComponent(channelName.replace(/\s/g, ""));
};

const updateURLWrapped = function (channelName) {
  if (window.location.pathname !== "/") {
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

const sendMessageToCS = function (toContentScriptEventName, channelName) {
  window.postMessage(
    {
      eventName: toContentScriptEventName,
      channelName: String(channelName),
    },
    "*",
  );
};

const preProcessCheck = function (input, params, toContentScriptEventName) {
  if (
    params.length >= 2 &&
    typeof input === "string" &&
    input.includes("https://gql.twitch.tv/gql")
  ) {
    let body = {};
    try {
      body = JSON.parse(params[1].body);
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log("ex", ex);
    }
    // the following is invoked from a /team/ page or the home page
    if (
      body &&
      Array.isArray(body) &&
      body.length > 0 &&
      body[0].variables &&
      body[0].variables.channel &&
      (window.location.pathname.startsWith("/team/") || window.location.pathname.startsWith("/"))
    ) {
      updateURLWrapped(body[0].variables.channel);
      sendMessageToCS(toContentScriptEventName, body[0].variables.channel);
    }
  }
};

const postRequestCheck = function (response, toContentScriptEventName) {
  if (response && response.url === "https://gql.twitch.tv/gql") {
    response
      .clone()
      .json()
      .then((respObj) => {
        if (Array.isArray(respObj) && respObj.length > 0) {
          let nameFound = false;
          for (let inx = 0; inx < respObj.length && nameFound === false; inx++) {
            const entry = respObj[inx];
            // capture channel name when loading a video with the URL https://www.twitch.tv/videos/...
            if (
              entry &&
              entry.data &&
              entry.data.video &&
              entry.data.video.owner &&
              entry.data.video.owner.displayName &&
              window.location.pathname.startsWith("/videos/")
            ) {
              nameFound = true;
              updateURLWrapped(entry.data.video.owner.displayName);
              sendMessageToCS(toContentScriptEventName, entry.data.video.owner.displayName);
            }
            // capture channel name when loading a video with the URL https://www.twitch.tv/clips/...
            if (
              entry &&
              entry.data &&
              entry.data.clip &&
              entry.data.clip.broadcaster &&
              entry.data.clip.broadcaster.displayName &&
              window.location.pathname.indexOf("/clip/")
            ) {
              nameFound = true;
              updateURLWrapped(entry.data.clip.broadcaster.displayName);
              sendMessageToCS(toContentScriptEventName, entry.data.clip.broadcaster.displayName);
            }
            if (
              entry &&
              entry.data &&
              entry.data.user &&
              entry.data.user.displayName &&
              (entry.data.user.channel || entry.data.user.stream) &&
              !window.location.pathname.startsWith("/directory/")
            ) {
              nameFound = true;
              updateURLWrapped(entry.data.user.displayName);
              sendMessageToCS(toContentScriptEventName, entry.data.user.displayName);
            }
            // capture channel name when clicking on the same channels multiple times
            // in the 'followed channels' panel on the left on the home page
            if (
              !nameFound &&
              entry &&
              entry.data &&
              entry.data.community &&
              entry.data.community.displayName &&
              !window.location.pathname.startsWith("/directory/")
            ) {
              nameFound = true;
              updateURLWrapped(entry.data.community.displayName);
              sendMessageToCS(toContentScriptEventName, entry.data.community.displayName);
            }
          }
        }
      });
  }
};

const wrapFetch = function ({ toContentScriptEventName }) {
  const myFetch = window.fetch;
  window.fetch = function theFetch(...args) {
    const params = args;
    let input = "";
    if (params.length >= 1) {
      [input] = params;
    }
    preProcessCheck(input, params, toContentScriptEventName);
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

const initWithParams = function () {
  try {
    const { params } = document.querySelector('script[data-name="capture-requests"]').dataset;
    wrapFetch(JSON.parse(params));
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
  }
};

const start = function () {
  initWithParams();
};

start();
