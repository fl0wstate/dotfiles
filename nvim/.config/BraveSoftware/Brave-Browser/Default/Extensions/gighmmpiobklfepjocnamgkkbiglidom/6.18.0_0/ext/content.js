/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

// This code is running in the global scope, so we need to encapsulate it
// to avoid unexpected interference with code in other files
{
  // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1408996
  let ext = window.ext; // eslint-disable-line no-redeclare

  // Firefox 55 erroneously sends messages from the content script to the
  // devtools panel:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1383310
  // As a workaround, listen for messages only if this isn't the devtools panel.
  // Note that Firefox processes API access lazily, so browser.devtools will
  // always exist but will have undefined as its value on other pages.
  if (!browser.devtools) {
    // Listen for messages from the background page.
    browser.runtime.onMessage.addListener((message, sender) => {
      let responses = ext.onMessage._dispatch(message, {});
      let response = ext.getMessageResponse(responses);
      if (!response) return;

      return Promise.resolve(response);
    });
  }
}
