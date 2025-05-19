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
/* global browser, DOMPurify translate, sessionStorageGet */

/* eslint-disable import/extensions */
import {
  COOKIE_FILTER_KEY,
  DISTRACTIONS_KEY,
  PAGE_INFO_KEY,
  addUserIdToUrl,
  closePopup,
  navigateTo,
  sendMessageWithNoResponse,
} from "../utils.js";

import BlockIcon from "./icons/block-distractions.js";
import CookieIcon from "./icons/cookie-icon.js";
import LockIcon from "./icons/lock-icon.js";
import LogoIcon from "./icons/adblock-logo.js";

const blockIconTemplate = `
  <div aria-hidden="true" class="popup-icon">${BlockIcon}</div>
`;

const cookieIconTemplate = `
  <div aria-hidden="true" class="popup-icon">${CookieIcon}</div>
`;

const lockIconTemplate = `
  <div class="popup-icon">${LockIcon}</div>
`;

const logoIconTemplate = `
  <div aria-hidden="true" class="popup-icon">${LogoIcon}</div>
`;

const icons = {
  locked: lockIconTemplate,
  blockedStats: logoIconTemplate,
  cookieWalls: cookieIconTemplate,
  blockDistractions: blockIconTemplate,
};

const namesToKeys = {
  cookieWalls: COOKIE_FILTER_KEY,
  blockDistractions: DISTRACTIONS_KEY,
};

const urls = {
  [COOKIE_FILTER_KEY]: "adblock-button-cookie-confirm.html",
  [DISTRACTIONS_KEY]: "adblock-button-distractions-confirm.html",
};

const toggleSubscription = async (key, evt) => {
  if (evt.target.checked) {
    setTimeout(() => navigateTo(urls[key]), 300);
    return;
  }

  await browser.runtime.sendMessage({ command: "unsubscribe", adblockId: key });
};

const generateToggle = function (key) {
  const toggle = document.createElement("toggle-button");
  toggle.dataset.name = key;

  const subscriptionActive = Boolean(this.pageInfo.subscriptions[key]);
  if (subscriptionActive) {
    toggle.dataset.isChecked = true;
  }

  toggle.addEventListener("change", toggleSubscription.bind(this, key));
  return toggle;
};

const generateLearnMore = async function (name) {
  const urlToOpen = await addUserIdToUrl("https://getadblock.com/premium/enrollment/");

  const button = document.createElement("button");
  button.innerText = translate("learn_more_without_period");
  button.addEventListener("click", () => {
    sendMessageWithNoResponse({ command: "recordGeneralMessage", msg: `${name}_learn_clicked` });
    sendMessageWithNoResponse({ command: "openTab", urlToOpen });
    closePopup();
  });

  return button;
};

const actionSectionGenerators = {
  blockedStats() {
    return document.createElement("span");
  },
  cookieWalls() {
    return generateToggle.call(this, COOKIE_FILTER_KEY);
  },
  blockDistractions() {
    return generateToggle.call(this, DISTRACTIONS_KEY);
  },
};

const generateTitle = (isActiveSection, { name, title }) => {
  const icon = isActiveSection ? icons[name] : icons.locked;
  const iconSpan = document.createElement("div");
  iconSpan.innerHTML = DOMPurify.sanitize(icon);

  const translatedTitle = translate(title);
  const titleSpan = document.createElement("div");
  titleSpan.textContent = translatedTitle;
  titleSpan.classList.add("title");

  const titleWrapper = document.createElement("div");
  titleWrapper.appendChild(iconSpan);
  titleWrapper.appendChild(titleSpan);
  titleWrapper.classList.add("title-wrapper");

  if (namesToKeys[name]) {
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = namesToKeys[name];
    titleLabel.appendChild(titleWrapper);

    return titleLabel;
  }

  return titleWrapper;
};

const generateSeparator = () => {
  const separator = document.createElement("div");
  separator.classList.add("inner-separator");
  return separator;
};

export default class PopupSection extends HTMLElement {
  async connectedCallback() {
    this.pageInfo = sessionStorageGet(PAGE_INFO_KEY);
    const { name } = this.dataset;
    const isBlockedStats = name === "blockedStats";

    if (!this.pageInfo.settings.display_menu_stats && isBlockedStats) {
      this.outerHTML = "";
      return;
    }

    const isActive = this.pageInfo.activeLicense;
    const isActiveSection = isActive || isBlockedStats;

    const titleSection = generateTitle(isActiveSection, this.dataset);
    const actionSection = isActiveSection
      ? actionSectionGenerators[name].call(this)
      : await generateLearnMore(name);

    const separator = generateSeparator();

    if (!isActiveSection) {
      this.classList.add("inactive-block");
    }

    const wrapper = document.createElement("div");
    wrapper.appendChild(titleSection);
    wrapper.appendChild(actionSection);
    this.prepend(separator);
    this.prepend(wrapper);
  }
}
