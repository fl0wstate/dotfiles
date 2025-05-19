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
/* global EventEmitter, browser, send */

/**
 * Act as Proxy to the Settings module
 *
 */
const settingsNotifier = new EventEmitter();
let localsettings = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let settings = {};
/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
const isValidTheme = async (name) => send("isValidTheme", { name });

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
async function initializeSettings() {
  localsettings = await send("getSettings");
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  settings = new Proxy(localsettings, {
    get(obj, prop) {
      return obj[prop];
    },
    set(objParm, prop, value) {
      const obj = objParm;
      obj[prop] = value;
      return send("setSetting", { name: prop, isEnabled: value });
    },
  });
}

const settingsPort = browser.runtime.connect({ name: "settings" });
settingsPort.onMessage.addListener((message) => {
  if (message.action === "changed" && message.args && message.args.length > 2) {
    const [key, value] = message.args;
    localsettings[key] = value;
    settingsNotifier.emit("settings.changed", ...message.args);
  }
});

settingsPort.postMessage({
  type: "settings.listen",
  filter: ["changed"],
});
