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
/* global EventEmitter, send, browser, sendTypeMessage */

/**
 * Act as Proxy to the Prefs module.
 * - emit events related to Prefs
 * - the current state of the cache Prefs should match the values in storage
 *
 */
const prefsNotifier = new EventEmitter();
const localprefs = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let Prefs = {};
let abpPrefPropertyNames = {};

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
async function initializePrefs() {
  abpPrefPropertyNames = await send("getABPPrefPropertyNames");
  abpPrefPropertyNames.forEach(async (key) => {
    localprefs[key] = await sendTypeMessage("prefs.get", { key });
  });

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  Prefs = new Proxy(localprefs, {
    get(obj, prop) {
      return obj[prop];
    },
    set(objParm, prop, value) {
      const obj = objParm;
      obj[prop] = value;
      return sendTypeMessage("prefs.set", { key: prop, value });
    },
  });

  const prefsPort = browser.runtime.connect({ name: "ui" });
  prefsPort.onMessage.addListener((message) => {
    if (message.type === "prefs.respond") {
      const key = message.action;
      const value = message.args[0];
      localprefs[key] = value;
      prefsNotifier.emit("prefs.changed", key, value);
    }
  });

  prefsPort.postMessage({
    type: "prefs.listen",
    filter: abpPrefPropertyNames,
  });
}
