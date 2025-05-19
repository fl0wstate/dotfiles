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
/* global browser, sessionStorageSet */

/* eslint-disable import/extensions */
import ActionButton from "./components/ActionButton.js";
import PopupDetailStats from "./components/PopupDetailStats.js";
import PopupDetailText from "./components/PopupDetailText.js";
import PopupSection from "./components/PopupSection.js";
import Toggle from "./components/Toggle.js";

import { PAGE_INFO_KEY, getTabId } from "./utils.js";

const initializeAndAddElements = () => {
  const tabId = getTabId();
  browser.runtime.sendMessage({ command: "getCurrentTabInfo", tabId }).then((pageInfo) => {
    sessionStorageSet(PAGE_INFO_KEY, pageInfo);
    // Defined in page
    customElements.define("action-button", ActionButton);
    customElements.define("popup-detail-stats", PopupDetailStats);
    customElements.define("popup-detail-text", PopupDetailText);
    customElements.define("popup-section", PopupSection);

    // Consumed by top-level components
    customElements.define("toggle-button", Toggle);
  });
};

const start = () => {
  initializeAndAddElements();
};

start();
