function extensionBlockTimerHandler(blockTime, turnType) {
  if (turnType === "Off") {
    setToStorage(getConstNotSyncing.extensionIsEnabledData, false);
    sendCommand(getConstNotSyncing.extensionIsEnabledData, false);

    if (blockTime === 0) {
      document.documentElement.setAttribute("disabled", true);
    } else {
      browser.storage.local.set({
        [getConstNotSyncing.extensionBlockLastedTime]: 0,
      });

      document.documentElement.setAttribute("disabled", true);

      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
          id: "untrap_extension_blockTime",
          action: "startBlockingExtension",
        });
      });
    }
  }

  if (turnType === "On") {
    setToStorage(getConstNotSyncing.extensionIsEnabledData, true);
    sendCommand(getConstNotSyncing.extensionIsEnabledData, true);

    if (blockTime === 0) {
      document.documentElement.setAttribute("disabled", false);
    } else {
      browser.storage.local.set({
        [getConstNotSyncing.extensionEnableLastedTime]: 0,
      });

      document.documentElement.setAttribute("disabled", false);


      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
          id: "untrap_extension_enableTime",
          action: "startEnableExtension",
        });
      });
    }
  }
}
