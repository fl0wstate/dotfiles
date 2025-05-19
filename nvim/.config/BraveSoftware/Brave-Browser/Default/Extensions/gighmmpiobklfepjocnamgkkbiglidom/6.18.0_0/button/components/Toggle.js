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

const createLabel = (name) => {
  const label = document.createElement("label");
  label.htmlFor = name;
  return label;
};

const createCheckbox = (name) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = name;
  return checkbox;
};

const createSlider = () => {
  const slider = document.createElement("span");
  slider.classList.add("slider", "round");
  return slider;
};

export default class Toggle extends HTMLElement {
  connectedCallback() {
    const { name, isChecked = false } = this.dataset;

    const label = createLabel(name);
    const checkbox = createCheckbox(name);
    checkbox.checked = isChecked;

    const slider = createSlider();

    label.appendChild(checkbox);
    label.appendChild(slider);
    this.appendChild(label);
  }
}
