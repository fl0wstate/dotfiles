/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2558:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* @@package_name - v@@version - @@timestamp */
/* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set sts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
  throw new Error("This script should only be loaded in a browser extension.");
}

if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
  const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

  // Wrapping the bulk of this polyfill in a one-time-use function is a minor
  // optimization for Firefox. Since Spidermonkey does not fully parse the
  // contents of a function until the first time it's called, and since it will
  // never actually need to be called, this allows the polyfill to be included
  // in Firefox nearly for free.
  const wrapAPIs = extensionAPIs => {
    // NOTE: apiMetadata is associated to the content of the api-metadata.json file
    // at build time by replacing the following "include" with the content of the
    // JSON file.
    const apiMetadata = __webpack_require__(2058);

    if (Object.keys(apiMetadata).length === 0) {
      throw new Error("api-metadata.json has not been included in browser-polyfill");
    }

    /**
     * A WeakMap subclass which creates and stores a value for any key which does
     * not exist when accessed, but behaves exactly as an ordinary WeakMap
     * otherwise.
     *
     * @param {function} createItem
     *        A function which will be called in order to create the value for any
     *        key which does not exist, the first time it is accessed. The
     *        function receives, as its only argument, the key being created.
     */
    class DefaultWeakMap extends WeakMap {
      constructor(createItem, items = undefined) {
        super(items);
        this.createItem = createItem;
      }

      get(key) {
        if (!this.has(key)) {
          this.set(key, this.createItem(key));
        }

        return super.get(key);
      }
    }

    /**
     * Returns true if the given object is an object with a `then` method, and can
     * therefore be assumed to behave as a Promise.
     *
     * @param {*} value The value to test.
     * @returns {boolean} True if the value is thenable.
     */
    const isThenable = value => {
      return value && typeof value === "object" && typeof value.then === "function";
    };

    /**
     * Creates and returns a function which, when called, will resolve or reject
     * the given promise based on how it is called:
     *
     * - If, when called, `chrome.runtime.lastError` contains a non-null object,
     *   the promise is rejected with that value.
     * - If the function is called with exactly one argument, the promise is
     *   resolved to that value.
     * - Otherwise, the promise is resolved to an array containing all of the
     *   function's arguments.
     *
     * @param {object} promise
     *        An object containing the resolution and rejection functions of a
     *        promise.
     * @param {function} promise.resolve
     *        The promise's resolution function.
     * @param {function} promise.reject
     *        The promise's rejection function.
     * @param {object} metadata
     *        Metadata about the wrapped method which has created the callback.
     * @param {boolean} metadata.singleCallbackArg
     *        Whether or not the promise is resolved with only the first
     *        argument of the callback, alternatively an array of all the
     *        callback arguments is resolved. By default, if the callback
     *        function is invoked with only a single argument, that will be
     *        resolved to the promise, while all arguments will be resolved as
     *        an array if multiple are given.
     *
     * @returns {function}
     *        The generated callback function.
     */
    const makeCallback = (promise, metadata) => {
      // In case we encounter a browser error in the callback function, we don't
      // want to lose the stack trace leading up to this point. For that reason,
      // we need to instantiate the error outside the callback function.
      let error = new Error();
      return (...callbackArgs) => {
        if (extensionAPIs.runtime.lastError) {
          error.message = extensionAPIs.runtime.lastError.message;
          promise.reject(error);
        } else if (metadata.singleCallbackArg ||
                   (callbackArgs.length <= 1 && metadata.singleCallbackArg !== false)) {
          promise.resolve(callbackArgs[0]);
        } else {
          promise.resolve(callbackArgs);
        }
      };
    };

    const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";

    /**
     * Creates a wrapper function for a method with the given name and metadata.
     *
     * @param {string} name
     *        The name of the method which is being wrapped.
     * @param {object} metadata
     *        Metadata about the method being wrapped.
     * @param {integer} metadata.minArgs
     *        The minimum number of arguments which must be passed to the
     *        function. If called with fewer than this number of arguments, the
     *        wrapper will raise an exception.
     * @param {integer} metadata.maxArgs
     *        The maximum number of arguments which may be passed to the
     *        function. If called with more than this number of arguments, the
     *        wrapper will raise an exception.
     * @param {boolean} metadata.singleCallbackArg
     *        Whether or not the promise is resolved with only the first
     *        argument of the callback, alternatively an array of all the
     *        callback arguments is resolved. By default, if the callback
     *        function is invoked with only a single argument, that will be
     *        resolved to the promise, while all arguments will be resolved as
     *        an array if multiple are given.
     *
     * @returns {function(object, ...*)}
     *       The generated wrapper function.
     */
    const wrapAsyncFunction = (name, metadata) => {
      return function asyncFunctionWrapper(target, ...args) {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          if (metadata.fallbackToNoCallback) {
            // This API method has currently no callback on Chrome, but it return a promise on Firefox,
            // and so the polyfill will try to call it with a callback first, and it will fallback
            // to not passing the callback if the first call fails.
            try {
              target[name](...args, makeCallback({resolve, reject}, metadata));
            } catch (cbError) {
              console.warn(`${name} API method doesn't seem to support the callback parameter, ` +
                           "falling back to call it without a callback: ", cbError);

              target[name](...args);

              // Update the API method metadata, so that the next API calls will not try to
              // use the unsupported callback anymore.
              metadata.fallbackToNoCallback = false;
              metadata.noCallback = true;

              resolve();
            }
          } else if (metadata.noCallback) {
            target[name](...args);
            resolve();
          } else {
            target[name](...args, makeCallback({resolve, reject}, metadata));
          }
        });
      };
    };

    /**
     * Wraps an existing method of the target object, so that calls to it are
     * intercepted by the given wrapper function. The wrapper function receives,
     * as its first argument, the original `target` object, followed by each of
     * the arguments passed to the original method.
     *
     * @param {object} target
     *        The original target object that the wrapped method belongs to.
     * @param {function} method
     *        The method being wrapped. This is used as the target of the Proxy
     *        object which is created to wrap the method.
     * @param {function} wrapper
     *        The wrapper function which is called in place of a direct invocation
     *        of the wrapped method.
     *
     * @returns {Proxy<function>}
     *        A Proxy object for the given method, which invokes the given wrapper
     *        method in its place.
     */
    const wrapMethod = (target, method, wrapper) => {
      return new Proxy(method, {
        apply(targetMethod, thisObj, args) {
          return wrapper.call(thisObj, target, ...args);
        },
      });
    };

    let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

    /**
     * Wraps an object in a Proxy which intercepts and wraps certain methods
     * based on the given `wrappers` and `metadata` objects.
     *
     * @param {object} target
     *        The target object to wrap.
     *
     * @param {object} [wrappers = {}]
     *        An object tree containing wrapper functions for special cases. Any
     *        function present in this object tree is called in place of the
     *        method in the same location in the `target` object tree. These
     *        wrapper methods are invoked as described in {@see wrapMethod}.
     *
     * @param {object} [metadata = {}]
     *        An object tree containing metadata used to automatically generate
     *        Promise-based wrapper functions for asynchronous. Any function in
     *        the `target` object tree which has a corresponding metadata object
     *        in the same location in the `metadata` tree is replaced with an
     *        automatically-generated wrapper function, as described in
     *        {@see wrapAsyncFunction}
     *
     * @returns {Proxy<object>}
     */
    const wrapObject = (target, wrappers = {}, metadata = {}) => {
      let cache = Object.create(null);
      let handlers = {
        has(proxyTarget, prop) {
          return prop in target || prop in cache;
        },

        get(proxyTarget, prop, receiver) {
          if (prop in cache) {
            return cache[prop];
          }

          if (!(prop in target)) {
            return undefined;
          }

          let value = target[prop];

          if (typeof value === "function") {
            // This is a method on the underlying object. Check if we need to do
            // any wrapping.

            if (typeof wrappers[prop] === "function") {
              // We have a special-case wrapper for this method.
              value = wrapMethod(target, target[prop], wrappers[prop]);
            } else if (hasOwnProperty(metadata, prop)) {
              // This is an async method that we have metadata for. Create a
              // Promise wrapper for it.
              let wrapper = wrapAsyncFunction(prop, metadata[prop]);
              value = wrapMethod(target, target[prop], wrapper);
            } else {
              // This is a method that we don't know or care about. Return the
              // original method, bound to the underlying object.
              value = value.bind(target);
            }
          } else if (typeof value === "object" && value !== null &&
                     (hasOwnProperty(wrappers, prop) ||
                      hasOwnProperty(metadata, prop))) {
            // This is an object that we need to do some wrapping for the children
            // of. Create a sub-object wrapper for it with the appropriate child
            // metadata.
            value = wrapObject(value, wrappers[prop], metadata[prop]);
          } else if (hasOwnProperty(metadata, "*")) {
            // Wrap all properties in * namespace.
            value = wrapObject(value, wrappers[prop], metadata["*"]);
          } else {
            // We don't need to do any wrapping for this property,
            // so just forward all access to the underlying object.
            Object.defineProperty(cache, prop, {
              configurable: true,
              enumerable: true,
              get() {
                return target[prop];
              },
              set(value) {
                target[prop] = value;
              },
            });

            return value;
          }

          cache[prop] = value;
          return value;
        },

        set(proxyTarget, prop, value, receiver) {
          if (prop in cache) {
            cache[prop] = value;
          } else {
            target[prop] = value;
          }
          return true;
        },

        defineProperty(proxyTarget, prop, desc) {
          return Reflect.defineProperty(cache, prop, desc);
        },

        deleteProperty(proxyTarget, prop) {
          return Reflect.deleteProperty(cache, prop);
        },
      };

      // Per contract of the Proxy API, the "get" proxy handler must return the
      // original value of the target if that value is declared read-only and
      // non-configurable. For this reason, we create an object with the
      // prototype set to `target` instead of using `target` directly.
      // Otherwise we cannot return a custom object for APIs that
      // are declared read-only and non-configurable, such as `chrome.devtools`.
      //
      // The proxy handlers themselves will still use the original `target`
      // instead of the `proxyTarget`, so that the methods and properties are
      // dereferenced via the original targets.
      let proxyTarget = Object.create(target);
      return new Proxy(proxyTarget, handlers);
    };

    /**
     * Creates a set of wrapper functions for an event object, which handles
     * wrapping of listener functions that those messages are passed.
     *
     * A single wrapper is created for each listener function, and stored in a
     * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
     * retrieve the original wrapper, so that  attempts to remove a
     * previously-added listener work as expected.
     *
     * @param {DefaultWeakMap<function, function>} wrapperMap
     *        A DefaultWeakMap object which will create the appropriate wrapper
     *        for a given listener function when one does not exist, and retrieve
     *        an existing one when it does.
     *
     * @returns {object}
     */
    const wrapEvent = wrapperMap => ({
      addListener(target, listener, ...args) {
        target.addListener(wrapperMap.get(listener), ...args);
      },

      hasListener(target, listener) {
        return target.hasListener(wrapperMap.get(listener));
      },

      removeListener(target, listener) {
        target.removeListener(wrapperMap.get(listener));
      },
    });

    const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
      if (typeof listener !== "function") {
        return listener;
      }

      /**
       * Wraps an onRequestFinished listener function so that it will return a
       * `getContent()` property which returns a `Promise` rather than using a
       * callback API.
       *
       * @param {object} req
       *        The HAR entry object representing the network request.
       */
      return function onRequestFinished(req) {
        const wrappedReq = wrapObject(req, {} /* wrappers */, {
          getContent: {
            minArgs: 0,
            maxArgs: 0,
          },
        });
        listener(wrappedReq);
      };
    });

    const onMessageWrappers = new DefaultWeakMap(listener => {
      if (typeof listener !== "function") {
        return listener;
      }

      /**
       * Wraps a message listener function so that it may send responses based on
       * its return value, rather than by returning a sentinel value and calling a
       * callback. If the listener function returns a Promise, the response is
       * sent when the promise either resolves or rejects.
       *
       * @param {*} message
       *        The message sent by the other end of the channel.
       * @param {object} sender
       *        Details about the sender of the message.
       * @param {function(*)} sendResponse
       *        A callback which, when called with an arbitrary argument, sends
       *        that value as a response.
       * @returns {boolean}
       *        True if the wrapped listener returned a Promise, which will later
       *        yield a response. False otherwise.
       */
      return function onMessage(message, sender, sendResponse) {
        let didCallSendResponse = false;

        let wrappedSendResponse;
        let sendResponsePromise = new Promise(resolve => {
          wrappedSendResponse = function(response) {
            didCallSendResponse = true;
            resolve(response);
          };
        });

        let result;
        try {
          result = listener(message, sender, wrappedSendResponse);
        } catch (err) {
          result = Promise.reject(err);
        }

        const isResultThenable = result !== true && isThenable(result);

        // If the listener didn't returned true or a Promise, or called
        // wrappedSendResponse synchronously, we can exit earlier
        // because there will be no response sent from this listener.
        if (result !== true && !isResultThenable && !didCallSendResponse) {
          return false;
        }

        // A small helper to send the message if the promise resolves
        // and an error if the promise rejects (a wrapped sendMessage has
        // to translate the message into a resolved promise or a rejected
        // promise).
        const sendPromisedResult = (promise) => {
          promise.then(msg => {
            // send the message value.
            sendResponse(msg);
          }, error => {
            // Send a JSON representation of the error if the rejected value
            // is an instance of error, or the object itself otherwise.
            let message;
            if (error && (error instanceof Error ||
                typeof error.message === "string")) {
              message = error.message;
            } else {
              message = "An unexpected error occurred";
            }

            sendResponse({
              __mozWebExtensionPolyfillReject__: true,
              message,
            });
          }).catch(err => {
            // Print an error on the console if unable to send the response.
            console.error("Failed to send onMessage rejected reply", err);
          });
        };

        // If the listener returned a Promise, send the resolved value as a
        // result, otherwise wait the promise related to the wrappedSendResponse
        // callback to resolve and send it as a response.
        if (isResultThenable) {
          sendPromisedResult(result);
        } else {
          sendPromisedResult(sendResponsePromise);
        }

        // Let Chrome know that the listener is replying.
        return true;
      };
    });

    const wrappedSendMessageCallback = ({reject, resolve}, reply) => {
      if (extensionAPIs.runtime.lastError) {
        // Detect when none of the listeners replied to the sendMessage call and resolve
        // the promise to undefined as in Firefox.
        // See https://github.com/mozilla/webextension-polyfill/issues/130
        if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
          resolve();
        } else {
          reject(new Error(extensionAPIs.runtime.lastError.message));
        }
      } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
        // Convert back the JSON representation of the error into
        // an Error instance.
        reject(new Error(reply.message));
      } else {
        resolve(reply);
      }
    };

    const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
      if (args.length < metadata.minArgs) {
        throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
      }

      if (args.length > metadata.maxArgs) {
        throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
      }

      return new Promise((resolve, reject) => {
        const wrappedCb = wrappedSendMessageCallback.bind(null, {resolve, reject});
        args.push(wrappedCb);
        apiNamespaceObj.sendMessage(...args);
      });
    };

    const staticWrappers = {
      devtools: {
        network: {
          onRequestFinished: wrapEvent(onRequestFinishedWrappers),
        },
      },
      runtime: {
        onMessage: wrapEvent(onMessageWrappers),
        onMessageExternal: wrapEvent(onMessageWrappers),
        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {minArgs: 1, maxArgs: 3}),
      },
      tabs: {
        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {minArgs: 2, maxArgs: 3}),
      },
    };
    const settingMetadata = {
      clear: {minArgs: 1, maxArgs: 1},
      get: {minArgs: 1, maxArgs: 1},
      set: {minArgs: 1, maxArgs: 1},
    };
    apiMetadata.privacy = {
      network: {"*": settingMetadata},
      services: {"*": settingMetadata},
      websites: {"*": settingMetadata},
    };

    return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
  };

  // The build process adds a UMD wrapper around this file, which makes the
  // `module` variable available.
  module.exports = wrapAPIs(chrome);
} else {
  module.exports = globalThis.browser;
}


/***/ }),

/***/ 2058:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"alarms":{"clear":{"minArgs":0,"maxArgs":1},"clearAll":{"minArgs":0,"maxArgs":0},"get":{"minArgs":0,"maxArgs":1},"getAll":{"minArgs":0,"maxArgs":0}},"bookmarks":{"create":{"minArgs":1,"maxArgs":1},"get":{"minArgs":1,"maxArgs":1},"getChildren":{"minArgs":1,"maxArgs":1},"getRecent":{"minArgs":1,"maxArgs":1},"getSubTree":{"minArgs":1,"maxArgs":1},"getTree":{"minArgs":0,"maxArgs":0},"move":{"minArgs":2,"maxArgs":2},"remove":{"minArgs":1,"maxArgs":1},"removeTree":{"minArgs":1,"maxArgs":1},"search":{"minArgs":1,"maxArgs":1},"update":{"minArgs":2,"maxArgs":2}},"browserAction":{"disable":{"minArgs":0,"maxArgs":1,"fallbackToNoCallback":true},"enable":{"minArgs":0,"maxArgs":1,"fallbackToNoCallback":true},"getBadgeBackgroundColor":{"minArgs":1,"maxArgs":1},"getBadgeText":{"minArgs":1,"maxArgs":1},"getPopup":{"minArgs":1,"maxArgs":1},"getTitle":{"minArgs":1,"maxArgs":1},"openPopup":{"minArgs":0,"maxArgs":0},"setBadgeBackgroundColor":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setBadgeText":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setIcon":{"minArgs":1,"maxArgs":1},"setPopup":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setTitle":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true}},"browsingData":{"remove":{"minArgs":2,"maxArgs":2},"removeCache":{"minArgs":1,"maxArgs":1},"removeCookies":{"minArgs":1,"maxArgs":1},"removeDownloads":{"minArgs":1,"maxArgs":1},"removeFormData":{"minArgs":1,"maxArgs":1},"removeHistory":{"minArgs":1,"maxArgs":1},"removeLocalStorage":{"minArgs":1,"maxArgs":1},"removePasswords":{"minArgs":1,"maxArgs":1},"removePluginData":{"minArgs":1,"maxArgs":1},"settings":{"minArgs":0,"maxArgs":0}},"commands":{"getAll":{"minArgs":0,"maxArgs":0}},"contextMenus":{"remove":{"minArgs":1,"maxArgs":1},"removeAll":{"minArgs":0,"maxArgs":0},"update":{"minArgs":2,"maxArgs":2}},"cookies":{"get":{"minArgs":1,"maxArgs":1},"getAll":{"minArgs":1,"maxArgs":1},"getAllCookieStores":{"minArgs":0,"maxArgs":0},"remove":{"minArgs":1,"maxArgs":1},"set":{"minArgs":1,"maxArgs":1}},"devtools":{"inspectedWindow":{"eval":{"minArgs":1,"maxArgs":2,"singleCallbackArg":false}},"panels":{"create":{"minArgs":3,"maxArgs":3,"singleCallbackArg":true},"elements":{"createSidebarPane":{"minArgs":1,"maxArgs":1}}}},"downloads":{"cancel":{"minArgs":1,"maxArgs":1},"download":{"minArgs":1,"maxArgs":1},"erase":{"minArgs":1,"maxArgs":1},"getFileIcon":{"minArgs":1,"maxArgs":2},"open":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"pause":{"minArgs":1,"maxArgs":1},"removeFile":{"minArgs":1,"maxArgs":1},"resume":{"minArgs":1,"maxArgs":1},"search":{"minArgs":1,"maxArgs":1},"show":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true}},"extension":{"isAllowedFileSchemeAccess":{"minArgs":0,"maxArgs":0},"isAllowedIncognitoAccess":{"minArgs":0,"maxArgs":0}},"history":{"addUrl":{"minArgs":1,"maxArgs":1},"deleteAll":{"minArgs":0,"maxArgs":0},"deleteRange":{"minArgs":1,"maxArgs":1},"deleteUrl":{"minArgs":1,"maxArgs":1},"getVisits":{"minArgs":1,"maxArgs":1},"search":{"minArgs":1,"maxArgs":1}},"i18n":{"detectLanguage":{"minArgs":1,"maxArgs":1},"getAcceptLanguages":{"minArgs":0,"maxArgs":0}},"identity":{"launchWebAuthFlow":{"minArgs":1,"maxArgs":1}},"idle":{"queryState":{"minArgs":1,"maxArgs":1}},"management":{"get":{"minArgs":1,"maxArgs":1},"getAll":{"minArgs":0,"maxArgs":0},"getSelf":{"minArgs":0,"maxArgs":0},"setEnabled":{"minArgs":2,"maxArgs":2},"uninstallSelf":{"minArgs":0,"maxArgs":1}},"notifications":{"clear":{"minArgs":1,"maxArgs":1},"create":{"minArgs":1,"maxArgs":2},"getAll":{"minArgs":0,"maxArgs":0},"getPermissionLevel":{"minArgs":0,"maxArgs":0},"update":{"minArgs":2,"maxArgs":2}},"pageAction":{"getPopup":{"minArgs":1,"maxArgs":1},"getTitle":{"minArgs":1,"maxArgs":1},"hide":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setIcon":{"minArgs":1,"maxArgs":1},"setPopup":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setTitle":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"show":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true}},"permissions":{"contains":{"minArgs":1,"maxArgs":1},"getAll":{"minArgs":0,"maxArgs":0},"remove":{"minArgs":1,"maxArgs":1},"request":{"minArgs":1,"maxArgs":1}},"runtime":{"getBackgroundPage":{"minArgs":0,"maxArgs":0},"getPlatformInfo":{"minArgs":0,"maxArgs":0},"openOptionsPage":{"minArgs":0,"maxArgs":0},"requestUpdateCheck":{"minArgs":0,"maxArgs":0},"sendMessage":{"minArgs":1,"maxArgs":3},"sendNativeMessage":{"minArgs":2,"maxArgs":2},"setUninstallURL":{"minArgs":1,"maxArgs":1}},"sessions":{"getDevices":{"minArgs":0,"maxArgs":1},"getRecentlyClosed":{"minArgs":0,"maxArgs":1},"restore":{"minArgs":0,"maxArgs":1}},"storage":{"local":{"clear":{"minArgs":0,"maxArgs":0},"get":{"minArgs":0,"maxArgs":1},"getBytesInUse":{"minArgs":0,"maxArgs":1},"remove":{"minArgs":1,"maxArgs":1},"set":{"minArgs":1,"maxArgs":1}},"managed":{"get":{"minArgs":0,"maxArgs":1},"getBytesInUse":{"minArgs":0,"maxArgs":1}},"sync":{"clear":{"minArgs":0,"maxArgs":0},"get":{"minArgs":0,"maxArgs":1},"getBytesInUse":{"minArgs":0,"maxArgs":1},"remove":{"minArgs":1,"maxArgs":1},"set":{"minArgs":1,"maxArgs":1}}},"tabs":{"captureVisibleTab":{"minArgs":0,"maxArgs":2},"create":{"minArgs":1,"maxArgs":1},"detectLanguage":{"minArgs":0,"maxArgs":1},"discard":{"minArgs":0,"maxArgs":1},"duplicate":{"minArgs":1,"maxArgs":1},"executeScript":{"minArgs":1,"maxArgs":2},"get":{"minArgs":1,"maxArgs":1},"getCurrent":{"minArgs":0,"maxArgs":0},"getZoom":{"minArgs":0,"maxArgs":1},"getZoomSettings":{"minArgs":0,"maxArgs":1},"goBack":{"minArgs":0,"maxArgs":1},"goForward":{"minArgs":0,"maxArgs":1},"highlight":{"minArgs":1,"maxArgs":1},"insertCSS":{"minArgs":1,"maxArgs":2},"move":{"minArgs":2,"maxArgs":2},"query":{"minArgs":1,"maxArgs":1},"reload":{"minArgs":0,"maxArgs":2},"remove":{"minArgs":1,"maxArgs":1},"removeCSS":{"minArgs":1,"maxArgs":2},"sendMessage":{"minArgs":2,"maxArgs":3},"setZoom":{"minArgs":1,"maxArgs":2},"setZoomSettings":{"minArgs":1,"maxArgs":2},"update":{"minArgs":1,"maxArgs":2}},"topSites":{"get":{"minArgs":0,"maxArgs":0}},"webNavigation":{"getAllFrames":{"minArgs":1,"maxArgs":1},"getFrame":{"minArgs":1,"maxArgs":1}},"webRequest":{"handlerBehaviorChanged":{"minArgs":0,"maxArgs":0}},"windows":{"create":{"minArgs":0,"maxArgs":1},"get":{"minArgs":1,"maxArgs":2},"getAll":{"minArgs":0,"maxArgs":1},"getCurrent":{"minArgs":0,"maxArgs":1},"getLastFocused":{"minArgs":0,"maxArgs":1},"remove":{"minArgs":1,"maxArgs":1},"update":{"minArgs":2,"maxArgs":2}}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/

// UNUSED EXPORTS: start

// EXTERNAL MODULE: ../../node_modules/webextension-polyfill/src/browser-polyfill.js
var browser_polyfill = __webpack_require__(2558);
;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/shared/messages.types.js
const youTubeAlreadyAllowListed = "yt-site.already.allowlisted";
const youTubeAutoAllowlisted = "yt-auto.allowlisted";
const youTubeWallDetected = "yt-site.ad-wall-detected";
const youTubeNavigation = "yt-site.navigation";
const ytHavenOverlayFlag = "yt-haven-overlay-iframe-enabled";
const ytHavenModalFlag = "yt-haven-overlay-modal-enabled";
const ytHavenIframeFlag = "yt-haven-iframe-enabled";
const matchingElementFoundKey = "matchingElementFound";
const ytHavenEmbeddedPlayerIssue = "yt-haven.embed-issue";
const ytHavenNeverShowOverlayClick = "yt-haven.never-show-overlay-clicked";
const ytHavenMetaTagFound = "yt-haven.meta-tag.found";
const ytHavenNextVideoNotFound = "yt-haven.next-video-not-found";
const ytHavenNonEmbeddableFound = "yt-haven.non-embeddable-found";
const ytHavenNonPlayableFound = "yt-haven.non-playable-found";
const ytHavenWatchCTAClicked = "yt-haven.watch-cta-clicked";
const ytHavenOverlayShown = "yt-haven.overlay-shown";
const ytHavenIframeShown = "yt-haven.iframe-shown";
const ytHavenModalClosed = "yt-haven.modal-closed";
const ytHavenLabelWatchingDisable = "yt-haven.label-watching-disable";
const ytHavenLabelWatchingIgnore = "yt-haven.watching-label-ignore";

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/detection.js


const adWallSelector = "ytd-enforcement-message-view-model";
const userAvatarSelector = "button#avatar-btn";
let adWallObserver;
function isElement(candidate) {
    return candidate instanceof Element;
}
async function adWallSelectorFound() {
    var _a;
    adWallObserver.disconnect();
    const videoPlayer = document.querySelector("video");
    const currentPlaybackTime = (_a = videoPlayer === null || videoPlayer === void 0 ? void 0 : videoPlayer.currentTime) !== null && _a !== void 0 ? _a : 0;
    const userLoggedIn = document.querySelectorAll(userAvatarSelector).length > 0;
    void browser_polyfill.runtime.sendMessage({
        type: youTubeWallDetected,
        userLoggedIn,
        currentPlaybackTime,
    });
}
function handleMutations(mutations) {
    const matchingElementFound = mutations.some(({ addedNodes }) => {
        const addedArrayNodes = Array.from(addedNodes);
        return addedArrayNodes.some((node) => isElement(node) && node.matches(adWallSelector));
    });
    if (matchingElementFound) {
        void adWallSelectorFound();
    }
}
function initializeObserver() {
    const observer = new MutationObserver(handleMutations);
    observer.observe(document, {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: true,
    });
    return observer;
}
function logInitialEvent() {
    const userLoggedIn = document.querySelectorAll(userAvatarSelector).length > 0;
    void browser_polyfill.runtime.sendMessage({ type: youTubeNavigation, userLoggedIn });
}
function handleLoadEvent() {
    window.onload = null;
    setTimeout(() => {
        logInitialEvent();
    }, 5000);
}
function checkWindow() {
    if (window.parent !== window) {
        return;
    }
    window.onload = handleLoadEvent;
}
function start() {
    adWallObserver = initializeObserver();
    checkWindow();
}

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/img/abp-logo.js
const abpLogo = `<svg viewBox="0 0 184 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.65145 0L0 9.59244V23.1585L9.65145 32.7509H23.3005L32.9523 23.1585V9.59244L23.3005 0H9.65145Z" fill="#D8D9D9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.74181 0.216309L0.217529 9.68203V23.0688L9.74181 32.5345H23.211L32.7349 23.0688V9.68203L23.211 0.216309H9.74181Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.3699 31.0273L1.73413 22.4443V10.3066L10.3699 1.72363H22.5827L31.2181 10.3066V22.4443L22.5827 31.0273H10.3699Z" fill="#ED1E45"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.42239 17.2011L8.19163 16.1451C8.04786 15.5705 7.90941 14.9604 7.77626 14.3149C7.64279 13.6697 7.50931 13.0477 7.37617 12.4494H7.31474C7.19156 13.0596 7.06572 13.6843 6.93789 14.3238C6.80939 14.9633 6.67359 15.5705 6.53015 16.1451L6.28379 17.2011H8.42239ZM8.88391 19.225H5.82227L5.20701 21.9527H2.89941L6.03775 10.4783H8.76073L11.8994 21.9527H9.49917L8.88391 19.225Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.8377 19.9465C18.0785 19.9465 18.6991 19.4244 18.6991 18.3803C18.6991 17.8757 18.5454 17.5091 18.2376 17.2804C17.9298 17.0514 17.4629 16.9372 16.8377 16.9372H15.5607V19.9465H16.8377ZM16.6222 15.1067C17.1761 15.1067 17.5785 14.9809 17.8298 14.7285C18.0812 14.4764 18.207 14.1332 18.207 13.6989C18.207 13.2649 18.0785 12.9541 17.8222 12.7663C17.5659 12.5785 17.1707 12.4845 16.6375 12.4845H15.5607V15.1067H16.6222ZM13.2993 10.4784H16.7298C17.2531 10.4784 17.7375 10.5223 18.1838 10.6104C18.63 10.6985 19.0195 10.854 19.3532 11.0767C19.6862 11.2998 19.9478 11.5932 20.1378 11.9565C20.3274 12.3205 20.4223 12.7782 20.4223 13.3293C20.4223 13.5877 20.3888 13.8457 20.3224 14.1038C20.2553 14.3619 20.1554 14.6024 20.0222 14.8252C19.8887 15.0483 19.7144 15.2476 19.4993 15.4235C19.2838 15.5997 19.0324 15.7287 18.7452 15.8109V15.8812C19.4631 16.0336 20.0043 16.3273 20.3685 16.761C20.7324 17.1952 20.9144 17.7995 20.9144 18.5737C20.9144 19.1604 20.8144 19.665 20.6146 20.0874C20.4147 20.5098 20.1378 20.8589 19.7838 21.1345C19.4299 21.4103 19.0168 21.6156 18.5454 21.7502C18.0735 21.8855 17.5659 21.9529 17.0223 21.9529H13.2993V10.4784Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M25.9915 16.0043C27.2223 16.0043 27.8376 15.3945 27.8376 14.1742C27.8376 13.5759 27.6812 13.1535 27.3684 12.907C27.0553 12.6604 26.5964 12.5374 25.9915 12.5374H24.7301V16.0043H25.9915ZM22.4683 10.4785H26.13C26.6735 10.4785 27.1838 10.5399 27.6606 10.6633C28.1377 10.7864 28.5531 10.9916 28.9067 11.2791C29.2607 11.5668 29.5399 11.948 29.7454 12.4232C29.9503 12.898 30.0529 13.4818 30.0529 14.1742C30.0529 14.8427 29.9476 15.4235 29.7375 15.9162C29.5273 16.4092 29.2427 16.8138 28.8838 17.1306C28.5246 17.4474 28.1092 17.6824 27.6377 17.8345C27.1656 17.9873 26.6632 18.0635 26.13 18.0635H24.7301V21.9526H22.4683V10.4785Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M64.1543 24.75C64.8901 24.75 65.5788 24.5813 66.2204 24.2439C66.8621 23.9065 67.431 23.5073 67.9272 23.0464H68.0042L68.1839 24.4537H69.9291V6.875H67.7989V11.4919L67.9015 13.5411C67.354 13.1131 66.815 12.7757 66.2846 12.5288C65.7542 12.2819 65.1295 12.1585 64.4109 12.1585C63.6923 12.1585 63.0079 12.3066 62.3577 12.6029C61.7076 12.8992 61.1344 13.3189 60.6381 13.8621C60.1419 14.4052 59.7441 15.0677 59.4447 15.8495C59.1453 16.6314 58.9955 17.5078 58.9955 18.4789C58.9955 20.487 59.4618 22.0342 60.3943 23.1205C61.3268 24.2068 62.5802 24.75 64.1543 24.75ZM48.0693 19.5159L46.4524 24.4537H44.2708L49.9686 8.2576H52.3811L58.0789 24.4537H55.7947L54.2034 19.5159H48.0693ZM48.6083 17.8617H53.6644L52.8688 15.3928C52.5608 14.4875 52.2699 13.5864 51.9962 12.6893C51.7224 11.7923 51.4486 10.8747 51.1749 9.93646H51.0722C50.8155 10.8747 50.5503 11.7923 50.2766 12.6893C50.0028 13.5864 49.7119 14.4875 49.4039 15.3928L48.6083 17.8617ZM62.0754 21.8367C62.6743 22.6432 63.5213 23.0464 64.6163 23.0464C65.1981 23.0464 65.7456 22.9107 66.2589 22.6391C66.7723 22.3675 67.2856 21.9519 67.7989 21.3923V15.1212C67.2685 14.6603 66.7594 14.3353 66.2718 14.146C65.7841 13.9567 65.2836 13.8621 64.7703 13.8621C64.2741 13.8621 63.8079 13.9732 63.3715 14.1954C62.9352 14.4176 62.5545 14.7303 62.2294 15.1335C61.9043 15.5368 61.6477 16.0182 61.4595 16.5779C61.2712 17.1375 61.1771 17.763 61.1771 18.4542C61.1771 19.9027 61.4766 21.0302 62.0754 21.8367ZM79.2898 24.75C80.0084 24.75 80.6928 24.606 81.343 24.3179C81.9932 24.0299 82.5664 23.6061 83.0626 23.0464C83.5588 22.4868 83.9524 21.8038 84.2433 20.9972C84.5341 20.1907 84.6796 19.2772 84.6796 18.2567C84.6796 17.335 84.5726 16.4997 84.3588 15.7508C84.1449 15.0019 83.8282 14.36 83.409 13.825C82.9898 13.2901 82.4723 12.8786 81.8563 12.5906C81.2404 12.3025 80.5303 12.1585 79.7261 12.1585C79.0246 12.1585 78.3401 12.319 77.6728 12.6399C77.0055 12.9609 76.3896 13.36 75.8249 13.8374L75.8762 11.6647V6.875H73.7716V24.4537H75.4656L75.6452 23.2193H75.7222C76.2698 23.6966 76.8558 24.071 77.4803 24.3426C78.1049 24.6142 78.708 24.75 79.2898 24.75ZM77.506 22.7625C78.045 22.9518 78.5198 23.0464 78.9305 23.0464C79.4438 23.0464 79.9186 22.9353 80.3549 22.7131C80.7912 22.4909 81.1676 22.1782 81.4842 21.775C81.8007 21.3717 82.0488 20.8738 82.2285 20.2813C82.4082 19.6887 82.498 19.0221 82.498 18.2814C82.498 17.623 82.4381 17.0223 82.3183 16.4791C82.1985 15.9359 82.0061 15.471 81.7408 15.0842C81.4756 14.6974 81.1334 14.397 80.7142 14.183C80.295 13.969 79.7945 13.8621 79.2128 13.8621C78.2033 13.8621 77.0911 14.4052 75.8762 15.4915V21.7873C76.4238 22.2482 76.967 22.5732 77.506 22.7625ZM89.831 24.75C90.1219 24.75 90.3615 24.7335 90.5497 24.7006C90.7379 24.6677 90.9004 24.6183 91.0373 24.5525L90.755 23.0218C90.6352 23.0547 90.5454 23.0711 90.4855 23.0711H90.293C90.139 23.0711 90.0021 23.0053 89.8824 22.8736C89.7626 22.7419 89.7027 22.5115 89.7027 22.1823V6.875H87.5981V22.0342C87.5981 22.923 87.7692 23.5978 88.1114 24.0587C88.4536 24.5196 89.0268 24.75 89.831 24.75ZM100.821 24.3303C100.128 24.6101 99.397 24.75 98.627 24.75C97.857 24.75 97.1256 24.6101 96.4326 24.3303C95.7396 24.0505 95.1279 23.6431 94.5975 23.1082C94.0671 22.5732 93.6436 21.9149 93.3271 21.133C93.0105 20.3512 92.8521 19.4665 92.8521 18.4789C92.8521 17.4749 93.0105 16.582 93.3271 15.8002C93.6436 15.0183 94.0671 14.3558 94.5975 13.8127C95.1279 13.2695 95.7396 12.858 96.4326 12.5782C97.1256 12.2984 97.857 12.1585 98.627 12.1585C99.397 12.1585 100.128 12.2984 100.821 12.5782C101.514 12.858 102.126 13.2695 102.656 13.8127C103.187 14.3558 103.61 15.0183 103.927 15.8002C104.243 16.582 104.402 17.4749 104.402 18.4789C104.402 19.4665 104.243 20.3512 103.927 21.133C103.61 21.9149 103.187 22.5732 102.656 23.1082C102.126 23.6431 101.514 24.0505 100.821 24.3303ZM98.627 23.0711C98.0966 23.0711 97.609 22.96 97.1641 22.7378C96.7192 22.5156 96.3384 22.2029 96.0219 21.7996C95.7053 21.3964 95.4616 20.9149 95.2905 20.3553C95.1194 19.7957 95.0338 19.1702 95.0338 18.4789C95.0338 17.7876 95.1194 17.1581 95.2905 16.5902C95.4616 16.0224 95.7053 15.5327 96.0219 15.1212C96.3384 14.7097 96.7192 14.3929 97.1641 14.1707C97.609 13.9485 98.0966 13.8374 98.627 13.8374C99.1574 13.8374 99.645 13.9485 100.09 14.1707C100.535 14.3929 100.915 14.7097 101.232 15.1212C101.549 15.5327 101.792 16.0224 101.963 16.5902C102.135 17.1581 102.22 17.7876 102.22 18.4789C102.22 19.1702 102.135 19.7957 101.963 20.3553C101.792 20.9149 101.549 21.3964 101.232 21.7996C100.915 22.2029 100.535 22.5156 100.09 22.7378C99.645 22.96 99.1574 23.0711 98.627 23.0711ZM114.404 24.3426C113.72 24.6142 113.001 24.75 112.248 24.75C111.427 24.75 110.657 24.6101 109.938 24.3303C109.22 24.0505 108.599 23.6431 108.077 23.1082C107.556 22.5732 107.145 21.9149 106.845 21.133C106.546 20.3512 106.396 19.4665 106.396 18.4789C106.396 17.4749 106.559 16.582 106.884 15.8002C107.209 15.0183 107.645 14.3558 108.193 13.8127C108.74 13.2695 109.378 12.858 110.105 12.5782C110.832 12.2984 111.598 12.1585 112.402 12.1585C113.223 12.1585 113.925 12.2984 114.507 12.5782C115.088 12.858 115.602 13.1872 116.047 13.5658L114.969 14.899C114.609 14.5863 114.229 14.3311 113.827 14.1336C113.424 13.9361 112.975 13.8374 112.479 13.8374C111.914 13.8374 111.393 13.9485 110.913 14.1707C110.434 14.3929 110.024 14.7097 109.681 15.1212C109.339 15.5327 109.07 16.0224 108.873 16.5902C108.676 17.1581 108.578 17.7876 108.578 18.4789C108.578 19.1702 108.672 19.7957 108.86 20.3553C109.048 20.9149 109.309 21.3964 109.643 21.7996C109.977 22.2029 110.383 22.5156 110.862 22.7378C111.341 22.96 111.863 23.0711 112.428 23.0711C113.009 23.0711 113.544 22.9518 114.032 22.7131C114.519 22.4745 114.96 22.1906 115.354 21.8614L116.278 23.2193C115.713 23.6966 115.088 24.071 114.404 24.3426ZM120.736 24.4537V21.2935L123.072 18.6765L126.716 24.4537H129.026L124.278 17.2692L128.461 12.4548H126.126L120.813 18.7752H120.736V6.875H118.657V24.4537H120.736ZM134.64 18.9974V24.4537H130.867V8.35635H136.616C137.54 8.35635 138.404 8.44277 139.208 8.61559C140.012 8.78841 140.714 9.07646 141.313 9.47971C141.911 9.88297 142.386 10.4179 142.737 11.0845C143.088 11.7511 143.263 12.57 143.263 13.5411C143.263 14.4793 143.088 15.294 142.737 15.9853C142.386 16.6766 141.911 17.2445 141.313 17.6889C140.714 18.1333 140.021 18.4625 139.234 18.6765C138.447 18.8904 137.608 18.9974 136.718 18.9974H134.64ZM136.487 16.1088H134.64V11.245H136.385C137.411 11.245 138.199 11.4178 138.746 11.7635C139.294 12.1091 139.567 12.7017 139.567 13.5411C139.567 15.2529 138.541 16.1088 136.487 16.1088ZM150.084 24.6636C149.768 24.7212 149.396 24.75 148.968 24.75C148.318 24.75 147.77 24.6512 147.325 24.4537C146.88 24.2562 146.525 23.9805 146.26 23.6266C145.995 23.2728 145.802 22.8448 145.683 22.3428C145.563 21.8408 145.503 21.277 145.503 20.6516V7.14658H149.276V20.7997C149.276 21.1783 149.348 21.4416 149.494 21.5898C149.639 21.7379 149.789 21.812 149.943 21.812H150.161C150.221 21.812 150.302 21.7955 150.405 21.7626L150.867 24.4537C150.662 24.536 150.401 24.606 150.084 24.6636ZM156.315 24.75C157.188 24.75 157.936 24.5731 158.561 24.2192C159.185 23.8653 159.771 23.3756 160.319 22.7502H160.396L160.678 24.4537H163.758V12.2079H159.985V20.3059C159.609 20.7833 159.258 21.1289 158.933 21.3429C158.608 21.5569 158.206 21.6638 157.727 21.6638C157.179 21.6638 156.777 21.4993 156.52 21.1701C156.264 20.8409 156.135 20.2319 156.135 19.3431V12.2079H152.362V19.8122C152.362 21.3593 152.675 22.5691 153.299 23.4415C153.924 24.3138 154.929 24.75 156.315 24.75ZM172.722 24.4414C172.072 24.6471 171.319 24.75 170.463 24.75C169.625 24.75 168.765 24.5936 167.884 24.2809C167.003 23.9682 166.237 23.5567 165.587 23.0464L167.281 20.775C167.863 21.203 168.419 21.5239 168.949 21.7379C169.48 21.9519 170.019 22.0589 170.566 22.0589C171.131 22.0589 171.541 21.9683 171.798 21.7873C172.055 21.6062 172.183 21.3511 172.183 21.0219C172.183 20.8244 172.11 20.6475 171.965 20.4911C171.819 20.3347 171.623 20.1907 171.375 20.059C171.126 19.9274 170.848 19.808 170.54 19.7011C170.232 19.5941 169.916 19.4747 169.591 19.3431C169.197 19.1949 168.804 19.0221 168.41 18.8246C168.017 18.6271 167.657 18.3843 167.332 18.0963C167.007 17.8082 166.742 17.4708 166.537 17.084C166.331 16.6972 166.229 16.2487 166.229 15.7384C166.229 15.1788 166.344 14.6603 166.575 14.183C166.806 13.7057 167.135 13.3024 167.563 12.9732C167.991 12.644 168.504 12.3848 169.103 12.1955C169.702 12.0062 170.369 11.9116 171.105 11.9116C172.08 11.9116 172.936 12.0721 173.672 12.393C174.407 12.714 175.049 13.072 175.597 13.467L173.903 15.6397C173.441 15.3105 172.987 15.0554 172.542 14.8743C172.098 14.6933 171.653 14.6027 171.208 14.6027C170.25 14.6027 169.77 14.9237 169.77 15.5656C169.77 15.7631 169.839 15.9318 169.976 16.0717C170.113 16.2116 170.297 16.3392 170.528 16.4544C170.759 16.5696 171.024 16.6807 171.323 16.7877C171.623 16.8947 171.935 17.0058 172.26 17.121C172.671 17.2692 173.077 17.4379 173.479 17.6272C173.881 17.8164 174.249 18.051 174.583 18.3308C174.916 18.6106 175.186 18.9521 175.391 19.3554C175.597 19.7587 175.699 20.2401 175.699 20.7997C175.699 21.3593 175.588 21.8778 175.366 22.3551C175.143 22.8325 174.81 23.2481 174.365 23.6019C173.92 23.9558 173.372 24.2356 172.722 24.4414Z" fill="white"/>
</svg>`;

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/img/ab-logo.js
const abLogo = `<svg viewBox="0 0 117 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M43.5616 9.41363H45.8906L52.4074 24.5998H49.3306L47.9204 21.125H41.3609L39.9934 24.5998H36.9807L43.5616 9.41363ZM46.9803 18.8085L44.6513 12.631L42.2796 18.8085H46.9803ZM61.7947 23.0555H61.752C61.3816 23.6847 60.8831 24.1423 60.2563 24.4282C59.6295 24.7142 58.9529 24.8572 58.2265 24.8572C57.4288 24.8572 56.7201 24.7178 56.1005 24.439C55.4809 24.1601 54.9503 23.7776 54.5087 23.2914C54.0671 22.8052 53.7324 22.2333 53.5045 21.5755C53.2765 20.9177 53.1626 20.2099 53.1626 19.452C53.1626 18.6941 53.2837 17.9863 53.5258 17.3285C53.768 16.6707 54.1063 16.0987 54.5407 15.6125C54.9752 15.1263 55.4987 14.7438 56.1112 14.465C56.7237 14.1861 57.3932 14.0467 58.1196 14.0467C58.604 14.0467 59.0313 14.0968 59.4016 14.1969C59.772 14.297 60.0996 14.4257 60.3845 14.5829C60.6694 14.7402 60.9115 14.9083 61.111 15.087C61.3104 15.2658 61.4742 15.4409 61.6024 15.6125H61.6665V8.38406H64.2305V24.5998H61.7947V23.0555ZM55.7266 19.452C55.7266 19.8524 55.7942 20.2385 55.9296 20.6102C56.0649 20.982 56.2643 21.3109 56.5278 21.5969C56.7913 21.8829 57.1083 22.1117 57.4786 22.2833C57.849 22.4549 58.2692 22.5407 58.7393 22.5407C59.2093 22.5407 59.6296 22.4549 59.9999 22.2833C60.3703 22.1117 60.6872 21.8829 60.9507 21.5969C61.2142 21.3109 61.4137 20.982 61.549 20.6102C61.6843 20.2385 61.752 19.8524 61.752 19.452C61.752 19.0516 61.6843 18.6655 61.549 18.2937C61.4137 17.9219 61.2142 17.593 60.9507 17.307C60.6872 17.021 60.3703 16.7922 59.9999 16.6206C59.6296 16.449 59.2093 16.3633 58.7393 16.3633C58.2692 16.3633 57.849 16.449 57.4786 16.6206C57.1083 16.7922 56.7913 17.021 56.5278 17.307C56.2643 17.593 56.0649 17.9219 55.9296 18.2937C55.7942 18.6655 55.7266 19.0516 55.7266 19.452ZM67.3787 9.41363H71.9939C72.6207 9.41363 73.2332 9.47798 73.8314 9.60668C74.4297 9.73537 74.9639 9.94629 75.4339 10.2394C75.904 10.5326 76.285 10.9151 76.5771 11.387C76.8691 11.8589 77.0151 12.4451 77.0151 13.1458C77.0151 14.0324 76.7765 14.7653 76.2993 15.3444C75.8221 15.9235 75.1775 16.3347 74.3656 16.5777V16.6206C74.8499 16.6635 75.3022 16.7887 75.7224 16.996C76.1426 17.2034 76.5058 17.4715 76.8121 17.8004C77.1184 18.1293 77.3569 18.5118 77.5279 18.9479C77.6988 19.3841 77.7843 19.8524 77.7843 20.3528C77.7843 21.1965 77.6098 21.8901 77.2608 22.4334C76.9118 22.9768 76.456 23.4094 75.8933 23.7311C75.3307 24.0529 74.6968 24.2781 73.9917 24.4068C73.2866 24.5355 72.5851 24.5998 71.8871 24.5998H67.3787V9.41363ZM69.1735 15.8485H71.6521C72.0794 15.8485 72.496 15.8199 72.902 15.7627C73.308 15.7055 73.6748 15.5875 74.0024 15.4088C74.33 15.23 74.5935 14.9798 74.7929 14.658C74.9924 14.3363 75.0921 13.9109 75.0921 13.3818C75.0921 12.9099 74.9995 12.5274 74.8143 12.2342C74.6291 11.9411 74.3834 11.7087 74.0772 11.5371C73.7709 11.3655 73.4219 11.2476 73.0302 11.1832C72.6385 11.1189 72.2432 11.0867 71.8443 11.0867H69.1735V15.8485ZM69.1735 22.9268H72.2076C72.6492 22.9268 73.0872 22.8803 73.5216 22.7874C73.9561 22.6944 74.3478 22.5443 74.6968 22.3369C75.0458 22.1296 75.3271 21.8579 75.5408 21.5218C75.7544 21.1858 75.8613 20.7747 75.8613 20.2885C75.8613 19.7594 75.758 19.3161 75.5515 18.9586C75.3449 18.6011 75.0743 18.3152 74.7395 18.1007C74.4048 17.8862 74.0202 17.736 73.5857 17.6502C73.1513 17.5644 72.7061 17.5215 72.2503 17.5215H69.1735V22.9268ZM80.5052 8.38406H82.1718V24.5998H80.5052V8.38406ZM84.7217 19.5807C84.7217 18.7942 84.857 18.0792 85.1277 17.4357C85.3983 16.7922 85.7687 16.2381 86.2388 15.7734C86.7088 15.3087 87.2715 14.9476 87.9267 14.6902C88.582 14.4328 89.2942 14.3041 90.0634 14.3041C90.8326 14.3041 91.5448 14.4328 92.2 14.6902C92.8553 14.9476 93.4179 15.3087 93.888 15.7734C94.3581 16.2381 94.7284 16.7922 94.9991 17.4357C95.2697 18.0792 95.405 18.7942 95.405 19.5807C95.405 20.3672 95.2697 21.0821 94.9991 21.7256C94.7284 22.3691 94.3581 22.9232 93.888 23.3879C93.4179 23.8527 92.8553 24.2137 92.2 24.4711C91.5448 24.7285 90.8326 24.8572 90.0634 24.8572C89.2942 24.8572 88.582 24.7285 87.9267 24.4711C87.2715 24.2137 86.7088 23.8527 86.2388 23.3879C85.7687 22.9232 85.3983 22.3691 85.1277 21.7256C84.857 21.0821 84.7217 20.3672 84.7217 19.5807ZM86.5165 19.5807C86.5165 20.1098 86.5984 20.5995 86.7622 21.05C86.926 21.5004 87.1646 21.8936 87.478 22.2297C87.7914 22.5657 88.1653 22.8303 88.5998 23.0233C89.0342 23.2164 89.5221 23.3129 90.0634 23.3129C90.6047 23.3129 91.0925 23.2164 91.527 23.0233C91.9614 22.8303 92.3354 22.5657 92.6487 22.2297C92.9621 21.8936 93.2007 21.5004 93.3645 21.05C93.5283 20.5995 93.6102 20.1098 93.6102 19.5807C93.6102 19.0516 93.5283 18.5618 93.3645 18.1114C93.2007 17.6609 92.9621 17.2677 92.6487 16.9317C92.3354 16.5956 91.9614 16.3311 91.527 16.138C91.0925 15.945 90.6047 15.8485 90.0634 15.8485C89.5221 15.8485 89.0342 15.945 88.5998 16.138C88.1653 16.3311 87.7914 16.5956 87.478 16.9317C87.1646 17.2677 86.926 17.6609 86.7622 18.1114C86.5984 18.5618 86.5165 19.0516 86.5165 19.5807ZM104.921 17.0711C104.564 16.6421 104.18 16.3311 103.767 16.138C103.354 15.945 102.898 15.8485 102.399 15.8485C101.844 15.8485 101.352 15.945 100.925 16.138C100.498 16.3311 100.145 16.5992 99.8673 16.9424C99.5895 17.2856 99.3794 17.6824 99.237 18.1328C99.0946 18.5833 99.0233 19.0659 99.0233 19.5807C99.0233 20.0955 99.1052 20.5781 99.269 21.0285C99.4329 21.4789 99.6608 21.8758 99.9528 22.219C100.245 22.5621 100.597 22.8303 101.01 23.0233C101.424 23.2164 101.886 23.3129 102.399 23.3129C103.496 23.3129 104.344 22.8982 104.942 22.0688L106.181 23.2485C105.697 23.8062 105.127 24.2137 104.472 24.4711C103.817 24.7285 103.126 24.8572 102.399 24.8572C101.63 24.8572 100.925 24.7285 100.284 24.4711C99.643 24.2137 99.0981 23.8491 98.6494 23.3772C98.2007 22.9053 97.8517 22.3477 97.6024 21.7042C97.3532 21.0607 97.2285 20.3529 97.2285 19.5807C97.2285 18.8228 97.3532 18.1221 97.6024 17.4786C97.8517 16.8351 98.2043 16.2775 98.6601 15.8056C99.1159 15.3337 99.6608 14.9655 100.295 14.7009C100.929 14.4364 101.63 14.3041 102.399 14.3041C103.14 14.3041 103.841 14.4328 104.504 14.6902C105.166 14.9476 105.747 15.348 106.245 15.8914L104.921 17.0711ZM107.919 8.38406H109.586V18.9801L114.137 14.5615H116.509L111.68 19.1302L117 24.5998H114.543L109.586 19.3233V24.5998H107.919V8.38406Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.90526 0.724969L0.722017 8.94064C0.259715 9.40478 0 10.0343 0 10.6906L0 22.3102C0 22.9666 0.259745 23.5961 0.722093 24.0602L8.90527 32.2751C9.36762 32.7393 9.9947 33 10.6486 33H22.2232C22.877 33 23.5041 32.7393 23.9665 32.2751L32.1497 24.0602C32.612 23.5961 32.8717 22.9666 32.8717 22.3102V10.6906C32.8717 10.0343 32.612 9.40478 32.1497 8.94064L23.9665 0.724969C23.5041 0.260781 22.877 0 22.2231 0L10.6486 0C9.99472 0 9.36761 0.260781 8.90526 0.724969Z" fill="#F40D12"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0441 28.4618C21.4899 28.4618 22.782 23.4473 22.782 23.4473L25.9076 14.4321C25.9076 14.4321 26.1898 13.4962 26.138 13.4858C23.2274 12.9399 22.6085 14.9988 22.6085 14.9988C22.6085 14.9988 21.4899 17.9154 21.3164 17.9154C21.1429 17.9154 21.1222 17.6997 21.1222 17.6997V7.22094C21.1222 7.22094 21.1765 5.86918 19.7937 5.86918C18.411 5.86918 18.4809 7.22354 18.4809 7.22354L18.4835 14.965C18.4835 14.965 18.5016 15.2769 18.2426 15.2769C18.0122 15.2769 18.0251 14.9754 18.0251 14.9754V5.64822C18.0251 5.64822 18.1106 4.12489 16.7122 4.12489C15.3139 4.12489 15.389 5.65862 15.389 5.65862L15.3761 14.861C15.3761 14.861 15.3942 15.1443 15.1637 15.1443C14.9488 15.1443 14.9566 14.8636 14.9566 14.8636V7.14816C14.9566 7.14816 15.0342 5.57804 13.61 5.57804C12.2117 5.57804 12.2868 7.17675 12.2868 7.17675L12.2738 15.3237C12.2738 15.3237 12.2997 15.5603 12.0796 15.5603C11.8466 15.5603 11.8517 15.3237 11.8517 15.3237L11.8414 10.3976C11.8414 10.3976 11.8543 9.03542 10.6787 9.03542C9.42797 9.03542 9.45128 10.3976 9.45128 10.3976V21.0297C9.45905 21.0271 9.13536 28.4618 16.0441 28.4618Z" fill="white"/>
</svg>`;

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/shared.js




const expStorageKey = "ewe:split_experiments";
const iframePlayerId = "yt-haven-embed-player";
const videoContextStore = {
    _videoContext: null,
    setVideoContext(newContext) {
        this._videoContext = newContext;
    },
    getVideoContext() {
        if (!this._videoContext) {
            throw new Error("Video store was not initialized properly");
        }
        return this._videoContext;
    },
};
async function getExperimentFlag(flagId) {
    const storedData = await browser_polyfill.storage.local.get(expStorageKey);
    const experiments = storedData[expStorageKey];
    if (!isPartialExperimentsData(experiments)) {
        return null;
    }
    if (experiments.overrides &&
        typeof experiments.overrides[flagId] !== "undefined") {
        return experiments.overrides[flagId];
    }
    if (experiments.flags && typeof experiments.flags[flagId] !== "undefined") {
        return experiments.flags[flagId];
    }
    return null;
}
async function isInHavenExperiment() {
    const ytHavenFlags = await Promise.all([
        getExperimentFlag(ytHavenIframeFlag),
        getExperimentFlag(ytHavenOverlayFlag),
        getExperimentFlag(ytHavenModalFlag),
    ]);
    return ytHavenFlags.some((result) => Boolean(result));
}
function isWatchPage() {
    const parsedUrl = new URL(window.location.href);
    const { hostname, pathname } = parsedUrl;
    const rightDomain = hostname === "www.youtube.com" || hostname === "youtube.com";
    const rightPath = pathname === "/watch" || pathname.startsWith("/watch/");
    return rightDomain && rightPath;
}
function isPartialExperimentsData(candidate) {
    return (candidate !== null &&
        typeof candidate === "object" &&
        ("flags" in candidate || "overrides" in candidate));
}
function getIframePlayer() {
    return document.getElementById(iframePlayerId);
}
function createIframePlayer(playerConfig) {
    const { videoId, playlistId, showWatchingWith, startSeconds, showInModal = false, } = playerConfig;
    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
    embedUrl.searchParams.set("controls", "1");
    embedUrl.searchParams.set("autoplay", "1");
    embedUrl.searchParams.set("enablejsapi", "1");
    if (startSeconds) {
        embedUrl.searchParams.set("start", startSeconds.toString());
    }
    if (playlistId) {
        embedUrl.searchParams.set("listType", "playlist");
        embedUrl.searchParams.set("list", playlistId);
    }
    if (showWatchingWith) {
        embedUrl.hash = "yt-haven";
    }
    const iframe = document.createElement("iframe");
    iframe.src = embedUrl.toString();
    iframe.id = iframePlayerId;
    iframe.style.border = "0";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    if (showInModal) {
        iframe.style.width = "50%";
        iframe.style.aspectRatio = "16/9";
        iframe.style.borderRadius = "12px";
    }
    else {
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.zIndex = "500";
    }
    iframe.onload = function () {
        setTimeout(() => {
            var _a;
            (_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage('{"event":"listening"}', "*");
        });
    };
    return iframe;
}
function createBackdrop(id) {
    const backdropElem = document.createElement("div");
    if (id) {
        backdropElem.id = id;
    }
    backdropElem.style.position = "absolute";
    backdropElem.style.top = "0";
    backdropElem.style.left = "0";
    backdropElem.style.width = "100%";
    backdropElem.style.height = "100%";
    backdropElem.style.display = "flex";
    backdropElem.style.flexDirection = "column";
    backdropElem.style.justifyContent = "center";
    backdropElem.style.zIndex = "1500";
    backdropElem.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    backdropElem.style.flexWrap = "nowrap";
    backdropElem.style.alignContent = "center";
    backdropElem.style.alignItems = "center";
    backdropElem.style.fontFamily = "'Roboto', 'Arial', sans-serif";
    return backdropElem;
}
function createLogoSVG() {
    const { short_name: extName } = browser_polyfill.runtime.getManifest();
    let extLogo = abLogo;
    if (extName === "Adblock Plus") {
        extLogo = abpLogo;
    }
    const logo = document.createElement("div");
    logo.innerHTML = extLogo;
    return logo.firstChild;
}

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/pause-video.js

let pauseObserver = null;
let lastPausedVideo = null;
const observeVideos = () => {
    pauseObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    if (node.tagName === "VIDEO") {
                        pauseVideo(node);
                    }
                }
            });
        });
    });
    pauseObserver.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
    });
};
const playListener = (event) => {
    if (event.target instanceof HTMLVideoElement && isWatchPage()) {
        lastPausedVideo = event.target;
        lastPausedVideo.pause();
    }
};
const pauseVideo = (video) => {
    if (!video.paused && isWatchPage()) {
        video.pause();
    }
    video.addEventListener("play", playListener);
};
const startPause = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach(pauseVideo);
    observeVideos();
};
const stopPause = () => {
    pauseObserver === null || pauseObserver === void 0 ? void 0 : pauseObserver.disconnect();
    pauseObserver = null;
    resumeCurrentVideo();
};
const pauseCurrentVideos = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        video.removeEventListener("play", playListener);
        pauseVideo(video);
    });
};
const resumeCurrentVideo = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        video.removeEventListener("play", playListener);
    });
    void (lastPausedVideo === null || lastPausedVideo === void 0 ? void 0 : lastPausedVideo.play());
};

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/embed-haven.js




var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["ENDED"] = 0] = "ENDED";
})(PlayerState || (PlayerState = {}));
const removeEmbedPlayer = () => {
    var _a;
    const playerElem = getIframePlayer();
    (_a = playerElem === null || playerElem === void 0 ? void 0 : playerElem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(playerElem);
};
async function handleEmbeddedVideoEnding() {
    const nextVideoAnchor = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button");
    if (nextVideoAnchor &&
        nextVideoAnchor instanceof HTMLAnchorElement &&
        nextVideoAnchor.href) {
        nextVideoAnchor.click();
        return;
    }
    const { nextVideoId } = videoContextStore.getVideoContext();
    const searchParams = new URLSearchParams(window.location.search);
    if (nextVideoId) {
        searchParams.set("v", nextVideoId);
        window.location.search = searchParams.toString();
        return;
    }
    removeEmbedPlayer();
    resumeCurrentVideo();
    void browser_polyfill.runtime.sendMessage({
        type: ytHavenNextVideoNotFound,
    });
}
const iFrameMessageListener = (event) => {
    var _a;
    const playerElem = getIframePlayer();
    if (playerElem &&
        playerElem instanceof HTMLIFrameElement &&
        event.source === playerElem.contentWindow &&
        "data" in event &&
        typeof event.data === "string") {
        const eventData = JSON.parse(event.data);
        const playerState = (_a = eventData === null || eventData === void 0 ? void 0 : eventData.info) === null || _a === void 0 ? void 0 : _a.playerState;
        if (playerState === PlayerState.ENDED) {
            void handleEmbeddedVideoEnding();
        }
    }
};
async function addEmbedVideoOnTop(targetElement) {
    var _a;
    const { videoId, playlistId, startSeconds } = videoContextStore.getVideoContext();
    let playerElem = getIframePlayer();
    if (!(playerElem instanceof HTMLIFrameElement)) {
        removeEmbedPlayer();
    }
    void browser_polyfill.runtime.sendMessage({
        type: ytHavenIframeShown,
    });
    if (playerElem && playerElem instanceof HTMLIFrameElement) {
        (_a = playerElem.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify({
            event: "command",
            func: "loadVideoById",
            args: [videoId, startSeconds],
        }), "*");
        return;
    }
    playerElem = createIframePlayer({
        videoId,
        playlistId,
        startSeconds,
        showWatchingWith: true,
    });
    window.addEventListener("message", (event) => {
        iFrameMessageListener(event);
    });
    targetElement.style.position = "relative";
    targetElement.style.overflow = "hidden";
    targetElement.appendChild(playerElem);
}
async function embed_haven_start(targetElement) {
    const isIframeEmbedExp = await getExperimentFlag(ytHavenIframeFlag);
    if (!isIframeEmbedExp) {
        return;
    }
    void addEmbedVideoOnTop(targetElement);
}

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/img/close.js
const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#f3f3f3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/modal-player.js




const modalId = "yt-haven-modal";
function createCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.ariaLabel = "close overlay";
    closeButton.innerHTML = closeIcon;
    closeButton.style.position = "absolute";
    closeButton.style.top = "1rem";
    closeButton.style.right = "1rem";
    closeButton.style.cursor = "pointer";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    return closeButton;
}
function createBrandingElement() {
    const logo = createLogoSVG();
    logo.style.height = "1.875rem";
    const brandingElement = document.createElement("div");
    brandingElement.style.marginTop = "2rem";
    brandingElement.style.color = "#FFF";
    brandingElement.style.fontSize = "1.25rem";
    brandingElement.style.display = "flex";
    brandingElement.style.alignItems = "center";
    brandingElement.style.gap = "1rem";
    brandingElement.innerText = browser_polyfill.i18n.getMessage("yt_haven_player_watching_with_label", "");
    brandingElement.appendChild(logo);
    return brandingElement;
}
function addVideoModal(targetElement) {
    const modalContainer = createBackdrop(modalId);
    modalContainer.style.position = "fixed";
    modalContainer.style.zIndex = "999999";
    const closeButton = createCloseButton();
    const brandingElem = createBrandingElement();
    const { videoId, playlistId, startSeconds } = videoContextStore.getVideoContext();
    const playerElem = createIframePlayer({
        videoId,
        playlistId,
        startSeconds,
        showInModal: true,
    });
    modalContainer.appendChild(closeButton);
    modalContainer.appendChild(playerElem);
    modalContainer.appendChild(brandingElem);
    targetElement.appendChild(modalContainer);
    function handleModalClose() {
        targetElement.removeChild(modalContainer);
        void browser_polyfill.runtime.sendMessage({
            type: ytHavenModalClosed,
        });
    }
    function closeModalOnKeydown(evt) {
        if (evt.key === "Escape") {
            handleModalClose();
            targetElement.removeEventListener("keydown", closeModalOnKeydown);
        }
    }
    function closeModalOnClick(evt) {
        var _a;
        if (((_a = evt.target) === null || _a === void 0 ? void 0 : _a.id) === modalId) {
            handleModalClose();
            targetElement.removeEventListener("click", closeModalOnClick);
        }
    }
    function closeModalButtonClick() {
        handleModalClose();
        closeButton.removeEventListener("click", closeModalButtonClick);
    }
    closeButton.addEventListener("click", closeModalButtonClick);
    targetElement.addEventListener("keydown", closeModalOnKeydown);
    targetElement.addEventListener("click", closeModalOnClick);
}
function removeVideoModal() {
    var _a;
    const modalContainer = document.getElementById(modalId);
    (_a = modalContainer === null || modalContainer === void 0 ? void 0 : modalContainer.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(modalContainer);
}

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/overlay.js






const { short_name: extName } = browser_polyfill.runtime.getManifest();
let videoOverlay;
function createTitle() {
    const title = document.createElement("span");
    title.innerText = browser_polyfill.i18n.getMessage("yt_haven_overlay_title", extName);
    title.style.fontWeight = "500";
    title.style.fontSize = "20px";
    title.style.marginBottom = "20px";
    title.style.color = "#fff";
    return title;
}
function createMessage() {
    const message = document.createElement("span");
    message.style.maxWidth = "600px";
    message.style.color = "#fff";
    message.style.fontSize = "14px";
    message.style.lineHeight = "24px";
    message.style.fontFamily = "'Roboto', 'Arial', sans-serif";
    message.style.textAlign = "center";
    message.style.marginBottom = "20px";
    message.innerText = browser_polyfill.i18n.getMessage("yt_haven_overlay_description", extName);
    return message;
}
function createButton(clickHandler) {
    const button = document.createElement("button");
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.lineHeight = "36px";
    button.style.borderRadius = "18px";
    button.style.border = "none";
    button.style.fontWeight = "500";
    button.style.padding = "0 16px";
    button.style.fontFamily = "'Roboto', 'Arial', sans-serif";
    button.addEventListener("click", () => {
        clickHandler();
    });
    return button;
}
function createWatchButton(clickHandler) {
    const watchButton = createButton(clickHandler);
    watchButton.style.color = "#000";
    watchButton.style.background = "#f1f1f1";
    watchButton.innerText = browser_polyfill.i18n.getMessage("yt_haven_overlay_cta_button", extName);
    watchButton.addEventListener("mouseover", () => {
        watchButton.style.backgroundColor = "#d9d9d9";
    });
    watchButton.addEventListener("mouseout", () => {
        watchButton.style.backgroundColor = "#f1f1f1";
    });
    return watchButton;
}
function createNeverShowButton(clickHandler) {
    const neverShowButton = createButton(clickHandler);
    neverShowButton.style.backgroundColor = "#333";
    neverShowButton.style.color = "#fff";
    neverShowButton.style.marginLeft = "10px";
    neverShowButton.innerText = browser_polyfill.i18n.getMessage("yt_haven_overlay_never_button");
    neverShowButton.addEventListener("mouseover", () => {
        neverShowButton.style.backgroundColor = "#555";
    });
    neverShowButton.addEventListener("mouseout", () => {
        neverShowButton.style.backgroundColor = "#333";
    });
    return neverShowButton;
}
function createCTAButtons(watchHandler, neverShowHandler) {
    const watchButton = createWatchButton(watchHandler);
    const neverShowButton = createNeverShowButton(neverShowHandler);
    const buttonContainer = document.createElement("div");
    buttonContainer.appendChild(watchButton);
    buttonContainer.appendChild(neverShowButton);
    return buttonContainer;
}
function getVideoOverlay(watchHandler, neverShowHandler) {
    const backdropElem = createBackdrop();
    const logoElem = createLogoSVG();
    logoElem.style.marginBottom = "1.25rem";
    logoElem.style.display = "block";
    logoElem.style.height = "3.75rem";
    const titleElem = createTitle();
    const descriptionElem = createMessage();
    const buttonContainer = createCTAButtons(watchHandler, neverShowHandler);
    backdropElem.appendChild(logoElem);
    backdropElem.appendChild(titleElem);
    backdropElem.appendChild(descriptionElem);
    backdropElem.appendChild(buttonContainer);
    return backdropElem;
}
async function insertOverlayExp(videoContainer) {
    const isOverlayIframeExp = await getExperimentFlag(ytHavenOverlayFlag);
    const isOverlayModalExp = await getExperimentFlag(ytHavenModalFlag);
    if (!isOverlayIframeExp && !isOverlayModalExp) {
        return;
    }
    removeVideoOverlay();
    const watchHandler = () => {
        if (isOverlayIframeExp) {
            removeVideoOverlay();
            const { videoId, playlistId, startSeconds } = videoContextStore.getVideoContext();
            const playerElem = createIframePlayer({
                videoId,
                playlistId,
                startSeconds,
                showWatchingWith: true,
            });
            videoContainer.appendChild(playerElem);
        }
        else {
            addVideoModal(document.body);
        }
        void browser_polyfill.runtime.sendMessage({
            type: ytHavenWatchCTAClicked,
        });
    };
    const neverShowHandler = () => {
        var _a;
        void browser_polyfill.runtime.sendMessage({
            type: ytHavenNeverShowOverlayClick,
        });
        stopPause();
        (_a = videoOverlay === null || videoOverlay === void 0 ? void 0 : videoOverlay.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(videoOverlay);
    };
    videoOverlay = getVideoOverlay(watchHandler, neverShowHandler);
    videoContainer.style.position = "relative";
    videoContainer.style.overflow = "hidden";
    videoContainer.appendChild(videoOverlay);
    void browser_polyfill.runtime.sendMessage({
        type: ytHavenOverlayShown,
    });
}
function removeVideoOverlay() {
    var _a;
    (_a = videoOverlay === null || videoOverlay === void 0 ? void 0 : videoOverlay.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(videoOverlay);
    removeEmbedPlayer();
    removeVideoModal();
}

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/haven.js






const ytPlayerSelector = "ytd-player";
var PlayabilityStatus;
(function (PlayabilityStatus) {
    PlayabilityStatus["OK"] = "OK";
})(PlayabilityStatus || (PlayabilityStatus = {}));
const addExperiments = async () => {
    const targetElement = document.querySelector(ytPlayerSelector);
    if (!targetElement) {
        return;
    }
    await Promise.all([
        insertOverlayExp(targetElement),
        embed_haven_start(targetElement),
    ]);
};
const removeExperiments = () => {
    removeVideoOverlay();
    removeEmbedPlayer();
};
const navigationListener = async (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    const videoId = (_c = (_b = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.endpoint) === null || _b === void 0 ? void 0 : _b.watchEndpoint) === null || _c === void 0 ? void 0 : _c.videoId;
    if (!isWatchPage() || !(await shouldStartExperiment()) || !videoId) {
        removeExperiments();
        return;
    }
    pauseCurrentVideos();
    const playlistId = (_f = (_e = (_d = event === null || event === void 0 ? void 0 : event.detail) === null || _d === void 0 ? void 0 : _d.endpoint) === null || _e === void 0 ? void 0 : _e.watchEndpoint) === null || _f === void 0 ? void 0 : _f.playlistId;
    const isEmbeddable = (_k = (_j = (_h = (_g = event === null || event === void 0 ? void 0 : event.detail) === null || _g === void 0 ? void 0 : _g.response) === null || _h === void 0 ? void 0 : _h.playerResponse) === null || _j === void 0 ? void 0 : _j.playabilityStatus) === null || _k === void 0 ? void 0 : _k.playableInEmbed;
    const playabilityStatus = (_p = (_o = (_m = (_l = event === null || event === void 0 ? void 0 : event.detail) === null || _l === void 0 ? void 0 : _l.response) === null || _m === void 0 ? void 0 : _m.playerResponse) === null || _o === void 0 ? void 0 : _o.playabilityStatus) === null || _p === void 0 ? void 0 : _p.status;
    if (!isEmbeddable || playabilityStatus !== PlayabilityStatus.OK) {
        resumeCurrentVideo();
        removeExperiments();
        void browser_polyfill.runtime.sendMessage({
            type: !isEmbeddable ? ytHavenNonEmbeddableFound : ytHavenNonPlayableFound,
            errorCode: playabilityStatus,
        });
        return;
    }
    const nextVideoId = (_z = (_y = (_x = (_w = (_v = (_u = (_t = (_s = (_r = (_q = event === null || event === void 0 ? void 0 : event.detail) === null || _q === void 0 ? void 0 : _q.response) === null || _r === void 0 ? void 0 : _r.response) === null || _s === void 0 ? void 0 : _s.contents) === null || _t === void 0 ? void 0 : _t.twoColumnWatchNextResults) === null || _u === void 0 ? void 0 : _u.autoplay) === null || _v === void 0 ? void 0 : _v.autoplay) === null || _w === void 0 ? void 0 : _w.sets[0]) === null || _x === void 0 ? void 0 : _x.autoplayVideo) === null || _y === void 0 ? void 0 : _y.watchEndpoint) === null || _z === void 0 ? void 0 : _z.videoId;
    const startSeconds = (_3 = (_2 = (_1 = (_0 = event === null || event === void 0 ? void 0 : event.detail) === null || _0 === void 0 ? void 0 : _0.response) === null || _1 === void 0 ? void 0 : _1.endpoint) === null || _2 === void 0 ? void 0 : _2.watchEndpoint) === null || _3 === void 0 ? void 0 : _3.startTimeSeconds;
    videoContextStore.setVideoContext({
        playlistId,
        isEmbeddable,
        videoId,
        nextVideoId,
        startSeconds,
    });
    await addExperiments();
};
const havenElementExits = () => {
    let metaTag = document.getElementById("yt-haven");
    if (metaTag) {
        return true;
    }
    metaTag = document.createElement("meta");
    metaTag.id = "yt-haven";
    (document.head || document.documentElement).prepend(metaTag);
    return false;
};
const iFrameErrorListener = (event) => {
    var _a, _b;
    const playerElem = getIframePlayer();
    if (playerElem &&
        playerElem instanceof HTMLIFrameElement &&
        event.source === playerElem.contentWindow &&
        "data" in event &&
        typeof event.data === "string") {
        const eventData = JSON.parse(event.data);
        const errorCode = (_b = (_a = eventData === null || eventData === void 0 ? void 0 : eventData.info) === null || _a === void 0 ? void 0 : _a.videoData) === null || _b === void 0 ? void 0 : _b.errorCode;
        if ((eventData === null || eventData === void 0 ? void 0 : eventData.event) === "initialDelivery" && errorCode) {
            void browser_polyfill.runtime.sendMessage({
                type: ytHavenEmbeddedPlayerIssue,
                errorCode,
            });
        }
    }
};
const shouldStartExperiment = async () => {
    const matchingElementFound = await browser_polyfill.storage.local.get(matchingElementFoundKey);
    return ((await isInHavenExperiment()) &&
        typeof matchingElementFound[matchingElementFoundKey] !== "undefined");
};
async function haven_start() {
    if (!(await shouldStartExperiment())) {
        return;
    }
    if (havenElementExits()) {
        void browser_polyfill.runtime.sendMessage({
            type: ytHavenMetaTagFound,
        });
        return;
    }
    startPause();
    window.addEventListener("yt-navigate-finish", (event) => {
        void navigationListener(event);
    });
    window.addEventListener("message", (event) => {
        iFrameErrorListener(event);
    });
}

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/main.js


function main_start() {
    void haven_start();
    start();
}
main_start();

;// CONCATENATED MODULE: ../../fragment/yt-wall-detection/dist/content/index.js


/******/ })()
;
//# sourceMappingURL=yt-auto-allowlist.preload.js.map