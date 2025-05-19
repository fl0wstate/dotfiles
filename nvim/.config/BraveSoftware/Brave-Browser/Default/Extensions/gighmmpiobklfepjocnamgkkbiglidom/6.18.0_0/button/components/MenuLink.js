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
/* global translate, sessionStorageGet */

/* eslint-disable import/extensions */
import { PAGE_INFO_KEY } from "../utils.js";

const showConditions = {
  undoAllowlist() {
    const disabledOrallowlisted = this.pageInfo.disabledSite || !this.pageInfo.whitelisted;
    const eligibleForUndo =
      !this.pageInfo.paused && !this.pageInfo.domainPaused && disabledOrallowlisted;

    return eligibleForUndo && this.pageInfo.customFilterCount;
  },
};

export default class MenuLink extends HTMLElement {
  async connectedCallback() {
    this.pageInfo = sessionStorageGet(PAGE_INFO_KEY);

    const { i18n, name } = this.dataset;

    if (showConditions[name] && !showConditions[name].call(this)) {
      this.outerHTML = "";
      return;
    }

    const actionLink = document.createElement("a");
    actionLink.innerText = translate(i18n);
    actionLink.href = this.getAttribute("href");

    this.appendChild(actionLink);
  }
}
