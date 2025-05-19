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
/* global browser */

/*
This content script, when injected into tab that is on twitch.tv, will:
  1) Inject a script tag into the page context to handle channel name updates
     (see script twitch-capture-requests for details)
  2) Add listeners for messages from injected script
*/

const toContentScriptEventName = `ab-twitch-channel-name-${Math.random().toString(36).substr(2)}`;

const injectScriptIntoTabJS = ({ src, name = "", params = {} }) => {
  const scriptElem = document.createElement("script");
  scriptElem.type = "module";
  scriptElem.src = browser.runtime.getURL(src);
  scriptElem.dataset.params = JSON.stringify(params);
  scriptElem.dataset.name = name;

  try {
    (document.head || document.documentElement).appendChild(scriptElem);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
};

const runOnTwitch = function () {
  // Inject main script and script on which it depends
  injectScriptIntoTabJS({ src: "purify.min.js" });
  injectScriptIntoTabJS({
    src: "adblock-twitch-capture-requests.js",
    name: "capture-requests",
    params: {
      toContentScriptEventName,
    },
  });

  // process the event messages from the injected script
  window.addEventListener("message", (event) => {
    if (event.data.channelName && event.data.eventName === toContentScriptEventName) {
      browser.runtime.sendMessage({
        command: "updateTwitchChannelName",
        channelName: event.data.channelName,
      });
    }
  });
};

const startTwitchChannelNameCapture = async function () {
  try {
    const settings = await browser.runtime.sendMessage({ command: "getSettings" });

    if (settings.twitch_channel_allowlist) {
      runOnTwitch();
    }
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
  }
};

void startTwitchChannelNameCapture();
