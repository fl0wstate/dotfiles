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
/* global DOMPurify, sessionStorageSet, translate */

/* eslint-disable import/extensions */
import { CLOSED_KEY } from "../utils.js";

const generateBackIconTemplate = (labelText) => `
  <i
    class="material-icons md-18"
    role="img"
    aria-label="${labelText}">
    chevron_left
  </i>
`;

const goBack = () => {
  const main = document.querySelector("main");
  main.classList.remove("animate-in");
  main.classList.add("animate-out");

  setTimeout(() => {
    sessionStorageSet(CLOSED_KEY, true);
    window.history.back();
  }, 300);
};

export default class SubNav extends HTMLElement {
  async connectedCallback() {
    const backIconButton = document.createElement("button");
    backIconButton.addEventListener("click", goBack);

    const backIconTemplate = generateBackIconTemplate(translate("back_flow_general"));
    backIconButton.innerHTML = DOMPurify.sanitize(backIconTemplate);

    const { title } = this.dataset;
    const titleSpan = document.createElement("span");
    titleSpan.textContent = translate(title);

    this.appendChild(backIconButton);
    this.appendChild(titleSpan);
  }
}
