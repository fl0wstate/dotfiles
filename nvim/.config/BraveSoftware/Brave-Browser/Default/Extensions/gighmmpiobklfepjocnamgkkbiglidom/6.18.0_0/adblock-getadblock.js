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
/* global browser, onReady */

const gabHostnames = [
  "getadblock.com",
  "dev.getadblock.com",
  "dev1.getadblock.com",
  "dev2.getadblock.com",
  "getadblockpremium.com",
];
const gabHostnamesWithProtocal = gabHostnames.map((host) => `https://${host}`);

// listen to messages from the background page
function onMessage(request, sender, sendResponse) {
  if (Object.prototype.hasOwnProperty.call(request, "dataMigrationStatus")) {
    browser.runtime.onMessage.removeListener(onMessage);
    window.postMessage({ dataMigrationStatus: request.dataMigrationStatus }, "*");
    sendResponse({});
  }
}

async function receiveMessage(event) {
  if (
    event.data &&
    gabHostnamesWithProtocal.includes(event.origin) &&
    event.data.command === "payment_success"
  ) {
    window.removeEventListener("message", receiveMessage);
    browser.runtime.onMessage.addListener(onMessage);
    const response = await modulesAsGlobal.messaging.send("adblock:payment_success", {
      version: 1,
      origin: event.origin,
    });
    window.postMessage(response, "*");
  }
}

window.addEventListener("message", receiveMessage, false);

async function unsubscribeAcceptableAds(event) {
  if (event.isTrusted === false) {
    return;
  }
  event.preventDefault();
  await browser.runtime.sendMessage({ command: "unsubscribe", adblockId: "acceptable_ads" });
  await browser.runtime.sendMessage({
    command: "recordGeneralMessage",
    msg: "disableacceptableads_clicked",
  });
  await browser.runtime.sendMessage({
    command: "openTab",
    urlToOpen: browser.runtime.getURL("options.html?aadisabled=true#general"),
  });
}

function handleOpenSettingsPageClick(event) {
  if (event.isTrusted === false) {
    return;
  }
  event.preventDefault();
  void browser.runtime.sendMessage({
    command: "openTab",
    urlToOpen: browser.runtime.getURL("options.html#general"),
  });
}

async function getStartedWithMyAdBlock(event) {
  if (event.isTrusted === false) {
    return;
  }
  event.stopImmediatePropagation();
  event.preventDefault();
  await browser.runtime.sendMessage({
    command: "openTab",
    urlToOpen: browser.runtime.getURL("options.html#mab"),
  });
}

onReady(async () => {
  if (gabHostnames.includes(document.location.hostname) && window.top === window.self) {
    window.addEventListener("message", receiveMessage, false);
    let response = await browser.storage.local.get("userid");
    if (response.userid) {
      const elemDiv = document.createElement("div");
      elemDiv.id = "adblockUserId";
      elemDiv.innerText = response.userid;
      elemDiv.style.display = "none";
      document.body.appendChild(elemDiv);
    }

    response = await modulesAsGlobal.messaging.send("adblock:isActiveLicense");
    const elemDiv = document.createElement("div");
    elemDiv.id = "isAdblockLicenseActive";
    elemDiv.innerText = response;
    elemDiv.style.display = "none";
    elemDiv.dataset.isAdblockLicenseActive = response;
    document.body.appendChild(elemDiv);

    document.querySelectorAll("#disableacceptableads").forEach((node) => {
      node.addEventListener("click", unsubscribeAcceptableAds);
    });

    // Listen to clicks on links to open the settings page
    document.querySelectorAll(".open-settings-page").forEach((node) => {
      node.addEventListener("click", handleOpenSettingsPageClick);
    });

    // Listen to clicks on 'Get Started With MyAdBlock' on v4 payment page
    document.querySelectorAll(".get-started-with-myadblock").forEach((node) => {
      node.addEventListener("click", getStartedWithMyAdBlock);
    });

    // add click handler for adblock subscribe clicks
    // similiar to the code here:
    // https://github.com/adblockplus/adblockpluschrome/blob/master/subscriptionLink.postload.js
    // the link host check ('subscribe.getadblock.com') is specific to the getadblock.com domain
    document.addEventListener(
      "click",
      (event) => {
        // Ignore right-clicks
        if (event.button === 2) {
          return;
        }

        // Ignore simulated clicks.
        if (event.isTrusted === false) {
          return;
        }

        // Search the link associated with the click
        let link = event.target;
        while (!(link instanceof HTMLAnchorElement)) {
          link = link.parentNode;

          if (!link) {
            return;
          }
        }

        let queryString = null;
        if (link.protocol === "http:" || link.protocol === "https:") {
          if (link.host === "subscribe.getadblock.com" && link.pathname === "/") {
            queryString = link.search.substr(1);
          }
        } else {
          return;
        }

        if (!queryString) {
          return;
        }

        // This is our link - make sure the browser doesn't handle it
        event.preventDefault();
        event.stopPropagation();

        // Decode URL parameters
        let title = null;
        let url = null;
        for (const param of queryString.split("&")) {
          const parts = param.split("=", 2);
          if (parts.length === 2) {
            switch (parts[0]) {
              case "title":
                title = decodeURIComponent(parts[1]);
                break;
              case "location":
                url = decodeURIComponent(parts[1]);
                break;
              default: // do nothing
            }
          }
        }
        if (!url) {
          return;
        }

        // Default title to the URL
        if (!title) {
          title = url;
        }

        // Trim spaces in title and URL
        title = title.trim();
        url = url.trim();
        if (!/^(https?|ftp):/.test(url)) {
          return;
        }

        browser.runtime.sendMessage({
          type: "subscriptions.add",
          title,
          url,
          confirm: true,
        });
      },
      true,
    );
  }
});
