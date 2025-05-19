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
/* global browser, DOMPurify, sessionStorageGet, translate */

/* eslint-disable import/extensions */
import { PAGE_INFO_KEY, splitAndTranslate, translateWithTags } from "../utils.js";

const allowInlineButton = {
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: /inline-link-button/,
    attributeNameCheck: /data-url/,
    allowCustomizedBuiltInElements: true,
  },
};

async function customFilters(i18n) {
  const pageUrl = new URL(this.pageInfo.url);
  const { host } = pageUrl;

  const customFilterCount = await browser.runtime.sendMessage({
    command: "getCustomFilterCount",
    host,
  });

  return translate(i18n, [customFilterCount.response, host]);
}

function distractionControl(i18n) {
  const mainText = splitAndTranslate(i18n);
  const link =
    "https://help.getadblock.com/support/solutions/articles/6000250028-about-distraction-control";
  const linkText = translateWithTags("dc_more_information", "", [
    `<inline-link-button data-url="${link}">`,
    "</inline-link-button>",
  ]);

  return `${mainText} ${linkText}`;
}

const textComputations = {
  customFilters,
  distractionControl,
};

export default class ConfirmText extends HTMLElement {
  async connectedCallback() {
    this.pageInfo = sessionStorageGet(PAGE_INFO_KEY);
    const { i18n, i18nCompute } = this.dataset;

    const para = document.createElement("p");
    const paraGuts = i18nCompute
      ? await textComputations[i18nCompute].call(this, i18n)
      : splitAndTranslate(i18n);

    para.innerHTML = DOMPurify.sanitize(paraGuts, allowInlineButton);

    this.appendChild(para);
  }
}
