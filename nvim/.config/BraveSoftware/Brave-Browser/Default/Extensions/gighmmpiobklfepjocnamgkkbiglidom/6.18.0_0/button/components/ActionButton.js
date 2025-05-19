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
/* global browser, DOMPurify, translate, sessionStorageGet */

/* eslint-disable import/extensions */
import {
  COOKIE_FILTER_KEY,
  DISTRACTIONS_KEY,
  PAGE_INFO_KEY,
  closePopup,
  returnToIndex,
  sendMessageWithNoResponse,
} from "../utils.js";

async function pauseOnDomain() {
  sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "domain_pause_clicked" });

  if (!this.pageInfo.url) {
    return;
  }

  const pageUrl = new URL(this.pageInfo.url);
  const { href } = pageUrl;
  await browser.runtime.sendMessage({
    command: "allowlistTab",
    url: href,
  });
  await browser.runtime.sendMessage({ command: "updateButtonUIAndContextMenus" });
  browser.tabs.reload();
  closePopup();
}

async function resumeThisPage() {
  sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "enable_adblock_clicked" });
  const { id } = this.pageInfo;

  const response = await browser.runtime.sendMessage({
    command: "removeAllAllowlistRulesForTab",
    tabId: id,
  });

  if (response) {
    await browser.runtime.sendMessage({ command: "updateButtonUIAndContextMenus" });
    browser.tabs.reload();
    closePopup();
  }
}

async function undoAllowlist() {
  sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: "undo_clicked" });

  const pageUrl = new URL(this.pageInfo.url);
  const { host } = pageUrl;
  await browser.runtime.sendMessage({ command: "removeCustomFilterForHost", host });
  browser.tabs.reload(this.pageInfo.id);
  returnToIndex();
}

async function addSubscription(id) {
  await sendMessageWithNoResponse({
    command: "recordGeneralMessage",
    msg: `popup_sub_clicked_${id}`,
  });
  await browser.runtime.sendMessage({ command: "subscribe", id });
  returnToIndex();
}

const actionHandlers = {
  confirmCookie: () => addSubscription(COOKIE_FILTER_KEY),
  confirmDistractions: () => addSubscription(DISTRACTIONS_KEY),
  pauseOnDomain,
  resumeThisPage,
  undoAllowlist,
};

const playIconTemplate = `
  <i
    class="material-icons md-18"
    role="img"
    aria-hidden="true">
    play_arrow
  </i>
`;

const pauseIconTemplate = `
  <i
    class="material-icons md-18"
    role="img"
    aria-hidden="true">
    pause
  </i>
`;

const icons = {
  none: "",
  play: playIconTemplate,
  pause: pauseIconTemplate,
};

const generateIconButton = (text, icon) =>
  `<span class="button-contents">${icons[icon]} ${translate(text)}`;

export default class ActionButton extends HTMLElement {
  async connectedCallback() {
    this.pageInfo = sessionStorageGet(PAGE_INFO_KEY);

    const { action, label, icon = "none", text = "ok", type = "primary" } = this.dataset;

    const buttonLabel = label ? translate(label) : translate(text);

    const actionButton = document.createElement("button");
    actionButton.ariaLabel = buttonLabel;
    actionButton.classList.add(`${type}-action`);
    actionButton.addEventListener("click", actionHandlers[action].bind(this));
    actionButton.innerHTML = DOMPurify.sanitize(generateIconButton(text, icon));

    this.appendChild(actionButton);
  }
}
