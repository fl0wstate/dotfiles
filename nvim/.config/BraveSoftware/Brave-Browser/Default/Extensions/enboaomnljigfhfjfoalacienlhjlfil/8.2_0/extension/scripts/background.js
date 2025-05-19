function getProStatus() {
  // Send Message to app
  browser.runtime.sendNativeMessage(
    "application.id",
    { message: "getProStatus" },
    function (appResponse) {
      // Send Response back to popup

      browser.runtime
        .sendMessage({
          command: "getProStatusResponse",
          isPRO: appResponse.isPRO,
        })
        .then((response) => {});
    }
  );
}

// Listen messages from popup

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getProStatus") {
    getProStatus();
  }
});
