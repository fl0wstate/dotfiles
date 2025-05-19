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

/**
 * Registers and emits events.
 */
/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
class ListenerSupport {
  constructor() {
    this.listeners = [];
  }

  /**
   * Adds a listener.
   *
   * @param {function} listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Removes a listener
   *
   * @param {function} listener
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Calls all previously added listeners with the provided data.
   *
   * @param {...*}   [args]
   */
  emit(...args) {
    this.listeners.forEach((listener) => listener(...args));
  }
}
