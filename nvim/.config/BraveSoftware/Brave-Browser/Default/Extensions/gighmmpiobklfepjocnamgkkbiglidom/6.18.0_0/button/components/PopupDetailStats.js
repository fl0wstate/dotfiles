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
/* global DOMPurify, sessionStorageGet */

/* eslint-disable import/extensions */
import { PAGE_INFO_KEY, translateWithTags } from "../utils.js";

const generateNumberAndLabel = (label, count) => {
  const numberSpanOpeningTemplate = '<span class="count-numbers">';
  const numberSpanClosingTemplate = "</span>";

  const translationWithCount = translateWithTags(label, count, [
    numberSpanOpeningTemplate,
    numberSpanClosingTemplate,
  ]);

  const wrapper = document.createElement("div");
  wrapper.classList.add("counts");
  wrapper.innerHTML = DOMPurify.sanitize(translationWithCount);

  return wrapper;
};

export default class PopupDetailStats extends HTMLElement {
  async connectedCallback() {
    this.pageInfo = sessionStorageGet(PAGE_INFO_KEY);

    const pageCountValue = this.pageInfo.blockCountPage.toLocaleString();
    const pageCount = generateNumberAndLabel("blocked_n_on_this_page", pageCountValue);

    const totalCountValue = this.pageInfo.blockCountTotal.toLocaleString();
    const totalCount = generateNumberAndLabel("blocked_n_in_total", totalCountValue);

    this.appendChild(pageCount);
    this.appendChild(totalCount);
  }
}
