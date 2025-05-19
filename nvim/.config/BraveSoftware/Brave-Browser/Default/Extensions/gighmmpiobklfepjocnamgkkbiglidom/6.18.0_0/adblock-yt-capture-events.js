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

/*
    This script is injected into the MAIN context on Youtube pages.
    See `yt-manage-cs` for injection point.
*/

const captureYTEvents = function ({ toContentScriptEventName }) {
  document.addEventListener("yt-action", (event) => {
    // Event emitted when more that 100 subscriptions are added
    if (event.detail && event.detail.actionName === "yt-append-continuation-items-action") {
      document.dispatchEvent(
        new CustomEvent(toContentScriptEventName, {
          detail: { actionName: "yt-append-continuation-items-action" },
        }),
      );
    }
  });
};

const initWithParams = function () {
  try {
    const { params } = document.querySelector('script[data-name="capture-events"]').dataset;
    captureYTEvents(JSON.parse(params));
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
  }
};

const start = function () {
  initWithParams();
};

start();
