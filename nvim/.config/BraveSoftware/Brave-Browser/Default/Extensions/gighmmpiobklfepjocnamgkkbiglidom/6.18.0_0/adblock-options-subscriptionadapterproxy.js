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
/* global send */

/**
 * Act as Proxy to the SubscriptionAdapter module
 *
 */
/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
class SubscriptionAdapter {
  static getIdFromURL = (url) => send("getIdFromURL", { url });

  static getAllSubscriptionsMinusText = () => send("getAllSubscriptionsMinusText");

  static isLanguageSpecific = (adblockId) => send("isLanguageSpecific", { adblockId });

  static getSubscriptionsMinusText = () => send("getSubscriptionsMinusText");
}
