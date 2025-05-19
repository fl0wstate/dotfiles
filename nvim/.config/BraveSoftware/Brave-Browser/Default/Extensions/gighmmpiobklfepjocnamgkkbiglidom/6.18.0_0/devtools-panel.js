/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */ /* eslint-disable */

(function () {
  "use strict";
  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  let port;
  const connectListeners = new Set();
  const disconnectListeners = new Set();
  const messageListeners = new Set();
  function addConnectListener(listener) {
    connectListeners.add(listener);
    listener();
  }
  function addDisconnectListener(listener) {
    disconnectListeners.add(listener);
  }
  function addMessageListener(listener) {
    messageListeners.add(listener);
  }
  const connect = () => {
    if (port) {
      return port;
    }
    try {
      port = browser.runtime.connect({ name: "ui" });
    } catch (ex) {
      port = null;
      disconnectListeners.forEach((listener) => listener());
      return port;
    }
    port.onMessage.addListener((message) => {
      onMessage(message);
    });
    port.onDisconnect.addListener(onDisconnect);
    connectListeners.forEach((listener) => listener());
    return port;
  };
  function listen(_a) {
    var { type, filter } = _a,
      options = __rest(_a, ["type", "filter"]);
    addConnectListener(() => {
      if (port) {
        port.postMessage(Object.assign({ type: `${type}.listen`, filter }, options));
      }
    });
  }
  function onDisconnect() {
    port = null;
    setTimeout(() => connect(), 100);
  }
  function onMessage(message) {
    if (!message.type.endsWith(".respond")) {
      return;
    }
    messageListeners.forEach((listener) => listener(message));
  }
  function removeDisconnectListener(listener) {
    disconnectListeners.delete(listener);
  }
  const platformToStore = {
    chromium: "chrome",
    edgehtml: "edge",
    gecko: "firefox",
  };
  const app = {
    get: (what) => send("app.get", { what }),
    getInfo: () =>
      __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([app.get("application"), app.get("platform")]).then(
          ([application, rawPlatform]) => {
            const platform = rawPlatform;
            let store;
            if (application !== "edge" && application !== "opera") {
              store = platformToStore[platform] || "chrome";
            } else {
              store = application;
            }
            return {
              application,
              platform,
              store,
            };
          },
        );
      }),
    listen: (filter) => listen({ type: "app", filter }),
    open: (what) => send("app.open", { what }),
  };
  const ctalinks = {
    get: (link, queryParams = {}) => send("app.get", { what: "ctalink", link, queryParams }),
  };
  const doclinks = {
    get: (link) => send("app.get", { what: "doclink", link }),
  };
  const filters = {
    get: () => send("filters.get"),
    listen: (filter) => listen({ type: "filters", filter }),
  };
  const notifications = {
    get: (displayMethod) => send("notifications.get", { displayMethod }),
    seen: () => send("notifications.seen"),
  };
  const prefs = {
    get: (key) => send("prefs.get", { key }),
    listen: (filter) => listen({ type: "prefs", filter }),
  };
  const premium = {
    activate: (userId) => send("premium.activate", { userId }),
    get: () => send("premium.get"),
    listen: (filter) => listen({ type: "premium", filter }),
  };
  const requests = {
    listen: (filter, tabId) => listen({ type: "requests", filter, tabId }),
  };
  function send(sendType, rawArgs = {}) {
    const args = Object.assign(Object.assign({}, rawArgs), { type: sendType });
    return browser.runtime.sendMessage(args);
  }
  const stats = {
    getBlockedPerPage: (tab) => send("stats.getBlockedPerPage", { tab }),
    getBlockedTotal: () => send("stats.getBlockedTotal"),
    listen: (filter) => listen({ type: "stats", filter }),
  };
  const subscriptions = {
    get: (options) => send("subscriptions.get", options),
    getInitIssues: () => send("subscriptions.getInitIssues"),
    listen: (filter) => listen({ type: "subscriptions", filter }),
  };
  const api = {
    addDisconnectListener,
    addListener: addMessageListener,
    app,
    ctalinks,
    doclinks,
    filters,
    notifications,
    prefs,
    premium,
    requests,
    removeDisconnectListener,
    subscriptions,
    stats,
  };
  connect();
  const i18nAttributes = ["alt", "placeholder", "title", "value"];
  function setElementText(element, stringName, args, children = []) {
    function processString(str, currentElement) {
      const match = /^(.*?)<(a|em|slot|strong)(\d)?>(.*?)<\/\2\3>(.*)$/.exec(str);
      if (match) {
        const [, before, name, index, innerText, after] = match;
        processString(before, currentElement);
        if (name == "slot") {
          const e = children[index];
          if (e) {
            currentElement.appendChild(e);
          }
        } else {
          const e = document.createElement(name);
          if (typeof index != "undefined") {
            e.dataset.i18nIndex = index;
          }
          processString(innerText, e);
          currentElement.appendChild(e);
        }
        processString(after, currentElement);
      } else currentElement.appendChild(document.createTextNode(str));
    }
    while (element.lastChild) element.removeChild(element.lastChild);
    processString(browser.i18n.getMessage(stringName, args), element);
  }
  function loadI18nStrings() {
    function resolveStringNames(container) {
      {
        const elements = container.querySelectorAll("[data-i18n]");
        for (const element of elements) {
          const children = Array.from(element.children);
          setElementText(element, element.dataset.i18n, null, children);
        }
      }
      for (const attr of i18nAttributes) {
        const elements = container.querySelectorAll(`[data-i18n-${attr}]`);
        for (const element of elements) {
          const stringName = element.getAttribute(`data-i18n-${attr}`);
          element.setAttribute(attr, browser.i18n.getMessage(stringName));
        }
      }
    }
    resolveStringNames(document);
    for (const template of document.querySelectorAll("template"))
      resolveStringNames(template.content);
  }
  function initI18n() {
    browser.runtime
      .sendMessage({
        type: "app.get",
        what: "localeInfo",
      })
      .then((localeInfo) => {
        document.documentElement.lang = localeInfo.locale;
        document.documentElement.dir = localeInfo.bidiDir;
      });
    loadI18nStrings();
  }
  let records = [];
  function add(target, filter, subscriptions) {
    const changes = [];
    const newRecord = {
      filter: getFilterInfo(filter, subscriptions),
      target,
    };
    let matchesAny = false;
    for (let i = 0; i < records.length; i++) {
      const oldRecord = records[i];
      const matches = hasRecord(newRecord, oldRecord);
      if (!matches) continue;
      matchesAny = true;
      if (!filter) break;
      if (oldRecord.filter) continue;
      oldRecord.filter = filter;
      changes.push({
        filter: oldRecord.filter,
        index: i,
        initialize: true,
        request: oldRecord.target,
        type: "update",
      });
    }
    if (!matchesAny) {
      changes.push({
        filter: newRecord.filter,
        request: newRecord.target,
        type: "add",
      });
      records.push(newRecord);
    }
    return changes;
  }
  function clear() {
    records = [];
  }
  function getFilterInfo(filter, subscriptions) {
    if (!filter) return null;
    let userDefined = false;
    let subscriptionTitle = null;
    for (const subscription of subscriptions) {
      if (!subscription.updatable) {
        userDefined = true;
        break;
      }
      subscriptionTitle = subscription.title;
      if (subscriptionTitle) break;
    }
    return {
      allowlisted: filter.type == "allowing" || filter.type == "elemhideexception",
      csp: filter.csp,
      selector: filter.selector,
      subscription: subscriptionTitle,
      text: filter.text,
      userDefined,
    };
  }
  function hasRecord(newRecord, oldRecord) {
    if (oldRecord.target.url !== newRecord.target.url) return false;
    if (oldRecord.target.docDomain !== newRecord.target.docDomain) return false;
    if (oldRecord.target.type === "DOCUMENT") {
      if (!newRecord.target.isFrame) return false;
    } else if (oldRecord.target.type !== newRecord.target.type) {
      return false;
    }
    if (oldRecord.filter && newRecord.filter) {
      if (oldRecord.filter.selector !== newRecord.filter.selector) return false;
    }
    if (oldRecord.filter && oldRecord.filter.csp && newRecord.filter && newRecord.filter.csp) {
      if (oldRecord.filter.text !== newRecord.filter.text) return false;
    }
    return true;
  }
  const recordManager = {
    add,
    clear,
  };
  const { getMessage } = browser.i18n;
  initI18n();
  const onFilterChangedByRow = new WeakMap();
  const promisedPlatform = api.app.get("platform");
  const maxTitleLength = 1000;
  let lastFilterQuery = null;
  browser.runtime.sendMessage({ type: "types.get" }).then((filterTypes) => {
    const filterTypesElem = document.getElementById("filter-type");
    const filterStyleElem = document.createElement("style");
    for (const type of filterTypes) {
      filterStyleElem.innerHTML +=
        `#items[data-filter-type=${type}] tr:not([data-type=${type}])` + "{display: none;}";
      const optionNode = document.createElement("option");
      optionNode.appendChild(document.createTextNode(type));
      filterTypesElem.appendChild(optionNode);
    }
    document.body.appendChild(filterStyleElem);
  });
  function generateFilter(request, options) {
    let { allowlisted = false, domainSpecific = false } = options;
    let filterText = request.url.replace(/^[\w-]+:\/+(?:www\.)?/, "||");
    const filterOptions = [];
    if (request.type == "POPUP") {
      filterOptions.push("popup");
      if (request.url == "about:blank") domainSpecific = true;
    }
    if (request.type == "CSP") filterOptions.push("csp");
    if (domainSpecific) filterOptions.push("domain=" + request.docDomain);
    if (filterOptions.length > 0) filterText += "$" + filterOptions.join(",");
    if (allowlisted) filterText = "@@" + filterText;
    return {
      allowlisted,
      subscription: null,
      text: filterText,
      userDefined: true,
    };
  }
  function createActionButton(action, stringId, filter, callback) {
    const button = document.createElement("span");
    button.textContent = getMessage(stringId);
    button.classList.add("action");
    button.addEventListener(
      "click",
      async () => {
        await browser.runtime.sendMessage({
          type: action === "add" ? "filters.add" : "filters.remove",
          text: filter.text,
          origin: modulesAsGlobal.filters.FilterOrigin.devtools,
        });
        callback(filter);
      },
      false,
    );
    return button;
  }
  function onUrlClick(event) {
    if (event.button != 0) return;
    if (!("openResource" in browser.devtools.panels)) return;
    browser.devtools.panels.openResource(event.target.href);
    event.preventDefault();
  }
  function getTitleText(str) {
    return promisedPlatform.then((platform) => {
      if (platform === "gecko") {
        const maxLineCount = maxTitleLength / 50;
        let lines = str.match(/.{1,50}/g);
        if (lines.length > maxLineCount) {
          lines = [...lines.slice(0, maxLineCount / 2), "…", ...lines.slice(-(maxLineCount / 2))];
        }
        return lines.join("\n");
      }
      if (str.length < maxTitleLength + 3) return str;
      return [str.slice(0, maxTitleLength / 2), "…", str.slice(-(maxTitleLength / 2))].join("\n");
    });
  }
  function onFilterRemoved(oldFilter) {
    const rows = document.querySelectorAll(`[data-filter="${oldFilter.text}"]`);
    for (const row of rows) {
      const onFilterChanged = onFilterChangedByRow.get(row);
      onFilterChanged(null);
    }
  }
  function createRow(request, filter, options = {}) {
    const { hasChanged = false, initialFilter = null } = options;
    const template = document.querySelector("template").content.firstElementChild;
    const row = document.importNode(template, true);
    row.dataset.type = request.type;
    row.classList.toggle("changed", hasChanged);
    row.querySelector(".domain").textContent = request.docDomain;
    row.querySelector(".type").textContent = request.type;
    const urlElement = row.querySelector(".url");
    const actionWrapper = row.querySelector(".action-wrapper");
    const onFilterChanged = (newFilter) => {
      const newRow = createRow(request, newFilter || initialFilter, {
        hasChanged: !!newFilter,
        initialFilter: newFilter ? initialFilter || filter : null,
      });
      row.parentNode.replaceChild(newRow, row);
      const container = document.getElementById("items");
      container.classList.add("has-changes");
    };
    onFilterChangedByRow.set(row, onFilterChanged);
    if (request.url) {
      setElementText(urlElement, "devtools_request_url", [request.url, request.rewrittenUrl]);
      const originalUrl = urlElement.querySelector("[data-i18n-index='0']");
      originalUrl.classList.add("url");
      getTitleText(request.url).then((title) => {
        originalUrl.setAttribute("title", title);
      });
      originalUrl.setAttribute("href", request.url);
      originalUrl.setAttribute("target", "_blank");
      if (request.type != "POPUP") {
        originalUrl.addEventListener("click", onUrlClick);
      }
      if (request.rewrittenUrl) {
        const rewrittenUrl = urlElement.querySelector("[data-i18n-index='1'");
        rewrittenUrl.classList.add("url-rewritten");
        getTitleText(request.rewrittenUrl).then((title) => {
          rewrittenUrl.setAttribute("title", title);
        });
        rewrittenUrl.setAttribute("href", request.rewrittenUrl);
        rewrittenUrl.setAttribute("target", "_blank");
        rewrittenUrl.addEventListener("click", onUrlClick);
      } else {
        urlElement.innerHTML = "";
        urlElement.appendChild(originalUrl);
      }
    } else {
      urlElement.innerHTML = "&nbsp;";
    }
    if (filter) {
      const filterElement = row.querySelector(".filter");
      const originElement = row.querySelector(".origin");
      getTitleText(filter.text).then((title) => {
        filterElement.setAttribute("title", title);
      });
      filterElement.textContent = filter.text;
      row.dataset.state = filter.allowlisted ? "allowlisted" : "blocked";
      row.dataset.filter = filter.text;
      if (filter.subscription) originElement.textContent = filter.subscription;
      else {
        if (filter.userDefined)
          originElement.textContent = getMessage("devtools_filter_origin_custom");
        else originElement.textContent = getMessage("devtools_filter_origin_none");
        originElement.classList.add("unnamed");
      }
      if (
        !filter.allowlisted &&
        request.type != "ELEMHIDE" &&
        request.type != "SNIPPET" &&
        !hasChanged
      ) {
        actionWrapper.appendChild(
          createActionButton(
            "add",
            "devtools_action_unblock",
            generateFilter(request, { allowlisted: true }),
            onFilterChanged,
          ),
        );
      }
      if (filter.userDefined) {
        actionWrapper.appendChild(
          createActionButton("remove", "devtools_action_remove", filter, onFilterRemoved),
        );
      }
    } else if (request.type !== "DOCUMENT") {
      actionWrapper.appendChild(
        createActionButton(
          "add",
          "devtools_action_block",
          generateFilter(request, { domainSpecific: request.specificOnly }),
          onFilterChanged,
        ),
      );
    }
    if (lastFilterQuery && shouldFilterRow(row, lastFilterQuery))
      row.classList.add("filtered-by-search");
    return row;
  }
  function shouldFilterRow(row, query) {
    const elementsToSearch = [
      row.getElementsByClassName("filter"),
      row.getElementsByClassName("origin"),
      row.getElementsByClassName("type"),
      row.getElementsByClassName("url"),
    ];
    for (const elements of elementsToSearch) {
      for (const element of elements) {
        if (element.innerText.search(query) != -1) return false;
      }
    }
    return true;
  }
  function performSearch(table, query) {
    for (const row of table.rows) {
      if (shouldFilterRow(row, query)) row.classList.add("filtered-by-search");
      else row.classList.remove("filtered-by-search");
    }
  }
  function cancelSearch(table) {
    for (const row of table.rows) row.classList.remove("filtered-by-search");
  }
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const container = document.getElementById("items");
      const table = container.querySelector("tbody");
      document.querySelector("[data-i18n='devtools_footer'] > a").addEventListener(
        "click",
        () => {
          browser.devtools.inspectedWindow.reload();
        },
        false,
      );
      document.getElementById("filter-state").addEventListener(
        "change",
        (event) => {
          container.dataset.filterState = event.target.value;
        },
        false,
      );
      document.getElementById("filter-type").addEventListener(
        "change",
        (event) => {
          container.dataset.filterType = event.target.value;
        },
        false,
      );
      api.addListener((message) => {
        if (message.type !== "requests.respond") return;
        switch (message.action) {
          case "hits":
            const [target, filter, subscriptions] = message.args;
            const changes = recordManager.add(target, filter, subscriptions);
            for (const change of changes) {
              switch (change.type) {
                case "add":
                  const row = createRow(change.request, change.filter);
                  table.appendChild(row);
                  break;
                case "update":
                  const oldRow = table.getElementsByTagName("tr")[change.index];
                  const newRow = createRow(change.request, change.filter);
                  oldRow.parentNode.replaceChild(newRow, oldRow);
                  break;
              }
            }
            break;
          case "reset":
            recordManager.clear();
            table.innerHTML = "";
            container.classList.remove("has-changes");
            break;
        }
      });
      api.requests.listen(["hits", "reset"], browser.devtools.inspectedWindow.tabId);
      window.addEventListener("message", (event) => {
        switch (event.data.type) {
          case "performSearch":
            performSearch(table, event.data.queryString);
            lastFilterQuery = event.data.queryString;
            break;
          case "cancelSearch":
            cancelSearch(table);
            lastFilterQuery = null;
            break;
        }
      });
      const theme = browser.devtools.panels.themeName || "default";
      document.body.classList.add(theme);
    },
    false,
  );
})();
