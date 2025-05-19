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
import CancelActionButton from "./components/CancelActionButton.js";
import ActionButton from "./components/ActionButton.js";
import ConfirmText from "./components/ConfirmText.js";
import InlineLinkButton from "./components/InlineLinkButton.js";
import SubNav from "./components/SubNav.js";

import { PAGE_INFO_KEY, getTabId, setupBehaviorListeners, translatePageTitle } from "./utils.js";

const initializeAndAddElements = () => {
  const tabId = getTabId();
  browser.runtime.sendMessage({ command: "getCurrentTabInfo", tabId }).then((pageInfo) => {
    sessionStorageSet(PAGE_INFO_KEY, pageInfo);
    customElements.define("action-button", ActionButton);
    customElements.define("cancel-action-button", CancelActionButton);
    customElements.define("confirm-text", ConfirmText);
    customElements.define("inline-link-button", InlineLinkButton);
    customElements.define("subsection-navigation", SubNav);
  });
};

const start = () => {
  setupBehaviorListeners();
  initializeAndAddElements();
  translatePageTitle();
};

start();
