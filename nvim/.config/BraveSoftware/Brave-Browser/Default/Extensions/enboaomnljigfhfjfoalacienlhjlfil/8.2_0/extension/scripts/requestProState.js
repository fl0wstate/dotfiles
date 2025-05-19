// Send Message to background.js

function getProStatusFromBG() {
  browser.runtime
    .sendMessage({ command: "getProStatus" })
    .then((response) => {});
}
// Listen Messages from background.js

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command == "getProStatusResponse") {
    // Set PRO status to html

    document.documentElement.setAttribute("isPRO", request.isPRO);

    // Set to app var

    app_isPRO = String(request.isPRO);

    // Try to sync

    tryToSyncFromServer();
  }
});
