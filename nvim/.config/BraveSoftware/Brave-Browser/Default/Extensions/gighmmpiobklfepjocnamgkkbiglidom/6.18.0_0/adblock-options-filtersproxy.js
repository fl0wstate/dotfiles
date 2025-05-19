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
/* global browser, ListenerSupport, sendTypeMessage, send */

/**
 * Act as Proxy to the ewe.filters.* APIs
 *
 */
class FiltersProxy {
  static add = (text, origin) => send("filters.add", { text, origin });

  static remove = (filters) => send("filters.remove", { filters });

  static validate = (text) => send("filters.validate", { text });

  static normalize = (text) => send("filters.normalize", { text });

  static getUserFilters = () => sendTypeMessage("filters.get");

  static onAdded = new ListenerSupport();

  static onChanged = new ListenerSupport();

  static onRemoved = new ListenerSupport();
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
async function initializeFiltersProxy() {
  const processMessage = (message) => {
    if (message && message.type === "filters.respond" && message.action) {
      switch (message.action) {
        case "added":
          FiltersProxy.onAdded.emit(message.args);
          break;
        case "changed":
          FiltersProxy.onChanged.emit(message.args);
          break;
        case "removed":
          FiltersProxy.onRemoved.emit(message.args);
          break;
        default:
          break;
      }
    }
  };

  const port = browser.runtime.connect({ name: "ui" });
  port.onMessage.addListener(processMessage);

  port.postMessage({
    type: "filters.listen",
    filter: ["added", "changed", "removed"],
  });
}
