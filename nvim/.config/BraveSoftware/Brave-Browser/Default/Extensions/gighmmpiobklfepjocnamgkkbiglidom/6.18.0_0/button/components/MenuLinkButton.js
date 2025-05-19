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
/* global browser, translate, sessionStorageGet */

/* eslint-disable import/extensions */
import { closePopup, PAGE_INFO_KEY, sendMessageWithNoResponse } from "../utils.js";

const eventHandlers = {
  async openAllowListWizard() {
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "whitelist_domain_clicked" });
    await browser.runtime.sendMessage({ command: "showWhitelist", tabId: this.pageInfo.id });
    closePopup();
  },
  async openHidingWizard() {
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "blacklist_clicked" });
    await browser.runtime.sendMessage({
      command: "showBlacklist",
      nothingClicked: true,
      tabId: this.pageInfo.id,
    });
    closePopup();
  },
};

const showConditions = {
  // TK
};

export default class MenuLinkButton extends HTMLElement {
  async connectedCallback() {
    this.pageInfo = sessionStorageGet(PAGE_INFO_KEY);

    const { clickHandler, i18n, name } = this.dataset;

    if (showConditions[name] && !showConditions[name].call(this)) {
      this.outerHTML = "";
      return;
    }

    const actionButton = document.createElement("button");
    actionButton.innerText = translate(i18n);
    actionButton.addEventListener("click", eventHandlers[clickHandler].bind(this));
    this.appendChild(actionButton);
  }
}
