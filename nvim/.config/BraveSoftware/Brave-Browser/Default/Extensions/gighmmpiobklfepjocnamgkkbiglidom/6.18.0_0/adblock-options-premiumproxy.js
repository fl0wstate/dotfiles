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
/* global EventEmitter, browser */

/**
 * Act as Proxy to the Premium modules - License, Channels, CustomChannel, SyncService
 *
 */

const licenseNotifier = new EventEmitter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let License;
let localLicense = {};

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
async function initializeLicense() {
  const returnPropertiesAsFunctions = [
    "shouldShowMyAdBlockEnrollment",
    "isActiveLicense",
    "shouldShowPremiumCTA",
    "getFormattedActiveSinceDate",
    "isLicenseCodeValid",
  ];
  localLicense = await modulesAsGlobal.messaging.send("adblock:getLicenseConfig");
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  License = new Proxy(localLicense, {
    get(obj, prop) {
      if (returnPropertiesAsFunctions.includes(prop)) {
        return () => obj[prop];
      }
      if (prop === "get") {
        return () => obj;
      }
      // The 'activate' function is here as a special case for testers to
      // enable premium (temporarily)
      if (prop === "activate") {
        return () => modulesAsGlobal.messaging.send("adblock:activate");
      }
      return Reflect.get(obj, prop);
    },
  });
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
const channelsNotifier = new EventEmitter();

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
class channels {
  static getIdByName = (name) =>
    modulesAsGlobal.messaging.send("adblock:channels.getIdByName", { name });

  static getGuide = () => modulesAsGlobal.messaging.send("adblock:channels.getGuide");

  static isAnyEnabled = () => modulesAsGlobal.messaging.send("adblock:channels.isAnyEnabled");

  static isCustomChannelEnabled = () =>
    modulesAsGlobal.messaging.send("adblock:channels.isCustomChannelEnabled");

  static initializeListeners = () =>
    modulesAsGlobal.messaging.send("adblock:channels.initializeListeners");

  static disableAllChannels = () =>
    modulesAsGlobal.messaging.send("adblock:channels.disableAllChannels");

  static setEnabled = (channelId, enabled) =>
    modulesAsGlobal.messaging.send("adblock:channels.setEnabled", { channelId, enabled });
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
class customChannel {
  static isMaximumAllowedImages = () =>
    modulesAsGlobal.messaging.send("adblock:customchannel.isMaximumAllowedImages");

  static getListings = () => modulesAsGlobal.messaging.send("adblock:customchannel.getListings");

  static addCustomImage = (imageInfo) =>
    modulesAsGlobal.messaging.send("adblock:customchannel.addCustomImage", { imageInfo });

  static removeListingByURL = (url) =>
    modulesAsGlobal.messaging.send("adblock:customchannel.removeListingByURL", { url });
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
async function initializeChannels() {
  channels.channelGuide = await channels.getGuide();
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
class SyncService {
  static enableSync = (initialGet) =>
    modulesAsGlobal.messaging.send("adblock:SyncService.enableSync", { initialGet });

  static disableSync = (removeName) =>
    modulesAsGlobal.messaging.send("adblock:SyncService.disableSync", { removeName });

  static getLastGetStatusCode = () =>
    modulesAsGlobal.messaging.send("adblock:SyncService.getLastGetStatusCode");

  static getLastPostStatusCode = () =>
    modulesAsGlobal.messaging.send("adblock:SyncService.getLastPostStatusCode");

  static resetAllErrors = () => modulesAsGlobal.messaging.send("SyncService.resetAllErrors");

  static processUserSyncRequest = () =>
    modulesAsGlobal.messaging.send("adblock:SyncService.processUserSyncRequest");

  static getAllExtensionNames = () =>
    modulesAsGlobal.messaging.send("adblock:SyncService.getAllExtensionNames");

  static getCurrentExtensionName = () =>
    modulesAsGlobal.messaging.send("adblock:SyncService.getCurrentExtensionName");

  static removeExtensionName = (dataDeviceName, dataExtensionGUID) =>
    modulesAsGlobal.messaging.send("adblock:SyncService.removeExtensionName", {
      dataDeviceName,
      dataExtensionGUID,
    });

  static setCurrentExtensionName = (name) =>
    modulesAsGlobal.messaging.send("adblock:SyncService.setCurrentExtensionName", { name });

  static syncNotifier = new EventEmitter();
}

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */
async function initializePremiumPort() {
  const premiumPort = browser.runtime.connect({ name: "premium" });
  premiumPort.onMessage.addListener(async (message) => {
    if (message.type === "sync.respond" && message.args) {
      SyncService.syncNotifier.emit(`${message.action}`, ...message.args);
    }
    if (message.type === "channels.respond") {
      channels.channelGuide = await channels.getGuide();
      if (message.args) {
        channelsNotifier.emit(`channels.${message.action}`, ...message.args);
      }
    }
    if (message.type === "license.respond") {
      localLicense = await modulesAsGlobal.messaging.send("adblock:getLicenseConfig");
      if (message.args) {
        licenseNotifier.emit(`license.${message.action}`, ...message.args);
      }
    }
  });
  premiumPort.postMessage({
    type: "sync.listen",
    filter: [
      "sync.data.receieved",
      "sync.data.getting",
      "sync.data.error.initial.fail",
      "sync.data.getting.error",
      "extension.names.downloading",
      "extension.names.downloaded",
      "extension.names.downloading.error",
      "extension.name.updating",
      "extension.name.updated",
      "extension.name.updated.error",
      "extension.name.remove",
      "extension.name.removed",
      "extension.name.remove.error",
      "post.data.sending",
      "post.data.sent",
      "post.data.sent.error",
    ],
  });
  premiumPort.postMessage({
    type: "channels.listen",
    filter: ["changed"],
  });
  premiumPort.postMessage({
    type: "license.listen",
    filter: ["updated", "updated.error", "expired"],
  });
}
