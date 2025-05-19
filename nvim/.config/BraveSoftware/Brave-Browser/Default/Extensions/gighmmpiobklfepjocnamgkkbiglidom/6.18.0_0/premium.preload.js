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
/* global browser, cloneInto */

/**
 * List of events that are waiting to be processed
 */
const eventQueue = [];
/**
 * Maximum number of failed requests after which events stop being handled
 */
const maxErrorThreshold = 30;
/**
 * Maximum number of events that can be queued up
 */
const maxQueuedEvents = 20;
/**
 * Interval period in milliseconds at which events are processed
 */
const processingDelay = 100;

/**
 * Number of failed requests
 */
let errorCount = 0;
/**
 * Interval identifier for processing events
 */
let processingIntervalId = null;

/**
 * Checks whether event contains authentication data
 *
 * @param {Event} event - Event
 *
 * @returns {boolean} whether event contains authentication data
 */
function isAuthRequestEvent(event) {
  return (
    event.detail &&
    typeof event.detail.signature === "string" &&
    typeof event.detail.timestamp === "number"
  );
}

/**
 * Check whether incoming event hasn't been tampered with
 *
 * @param {Event} event - DOM event
 *
 * @returns {boolean} whether the event can be trusted
 */
function isTrustedEvent(event) {
  return (
    Object.getPrototypeOf(event) === CustomEvent.prototype &&
    !Object.hasOwnProperty.call(event, "detail")
  );
}

/**
 * Retrieves requested payload and additional info from background page
 *
 * @param {Event} event - "flattr-request-payload" DOM event
 *
 * @returns {Promise<Object>} Object containing payload and extras
 */
async function getPayloadAndExtras(event) {
  return browser.runtime.sendMessage({
    command: "users.isPaying",
    timestamp: event.detail.timestamp,
    signature: event.detail.signature,
  });
}

/**
 * Queues up incoming requests
 *
 * @param {Event} event - "flattr-request-payload" DOM event
 */
function handleFlattrRequestPayloadEvent(event) {
  if (eventQueue.length >= maxQueuedEvents) {
    return;
  }

  eventQueue.push(event);
  startProcessingInterval();
}

/**
 * Processes incoming requests
 *
 * @returns {Promise<void>}
 */
async function processNextEvent() {
  const event = eventQueue.shift();
  if (event && isTrustedEvent(event) && isAuthRequestEvent(event)) {
    try {
      const { payload, extensionInfo } = await getPayloadAndExtras(event);

      if (payload === null && extensionInfo === null) {
        throw new Error("Premium request rejected");
      }

      let detail = { detail: { payload, extensionInfo } };
      if (typeof cloneInto === "function") {
        // Firefox requires content scripts to clone objects
        // that are passed to the document
        detail = cloneInto(detail, document.defaultView);
      }
      document.dispatchEvent(new CustomEvent("flattr-payload", detail));
      stop();
    } catch {
      errorCount += 1;
      if (errorCount >= maxErrorThreshold) {
        stop();
      }
    }
  }

  if (!eventQueue.length) {
    stopProcessingInterval();
  }
}

/**
 * Starts interval for processing incoming requests
 */
function startProcessingInterval() {
  if (processingIntervalId) {
    return;
  }

  processNextEvent();
  processingIntervalId = setInterval(processNextEvent, processingDelay);
}

/**
 * Stops interval for processing incoming requests
 */
function stopProcessingInterval() {
  clearInterval(processingIntervalId);
  processingIntervalId = null;
}

/**
 * Initializes module
 */
function start() {
  document.addEventListener("flattr-request-payload", handleFlattrRequestPayloadEvent, true);
}

/**
 * Uninitializes module
 */
function stop() {
  document.removeEventListener("flattr-request-payload", handleFlattrRequestPayloadEvent, true);
  eventQueue.length = 0;
  stopProcessingInterval();
}

start();
