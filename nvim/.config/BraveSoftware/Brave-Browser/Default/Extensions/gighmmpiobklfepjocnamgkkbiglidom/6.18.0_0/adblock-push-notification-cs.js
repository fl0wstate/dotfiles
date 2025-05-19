/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

const addDenyPushNotificationScript = function () {
    try {
        const scriptElem = document.createElement("script");
        scriptElem.type = "module";
        scriptElem.src = browser.runtime.getURL("adblock-deny-push-notifications-requests.js");
        (document.head || document.documentElement).appendChild(scriptElem);
    }
    catch (err) {
        console.error(err);
    }
};
addDenyPushNotificationScript();

/******/ })()
;
//# sourceMappingURL=adblock-push-notification-cs.js.map