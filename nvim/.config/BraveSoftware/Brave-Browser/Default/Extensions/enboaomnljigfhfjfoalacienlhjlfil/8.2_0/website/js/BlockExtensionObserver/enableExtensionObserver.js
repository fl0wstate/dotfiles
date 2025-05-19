(function () {
  let intervalId;

  const extensionEnableTimeKey = getConstNotSyncing.extensionEnableTime;
  const extensionEnableLastedTimeKey =
    getConstNotSyncing.extensionEnableLastedTime;

  document.addEventListener("DOMContentLoaded", () => {
    browser.storage.local.get(
      [extensionEnableTimeKey, extensionEnableLastedTimeKey],
      function (obj) {
        const extensionEnableLimitDuration = obj[extensionEnableTimeKey];
        let extensionEnableLimitLastedTime = obj[extensionEnableLastedTimeKey];

        if (
          extensionEnableLimitDuration !== undefined &&
          extensionEnableLimitLastedTime !== undefined &&
          extensionEnableLimitDuration !== 0
        ) {
          if (
            extensionEnableLimitLastedTime <=
            getSecondsFromMinutes(extensionEnableLimitDuration)
          ) {
            stopTimer();
            startExtensionEnableTimer();
          }
        }
      }
    );
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "startEnableExtension") {
      stopTimer();
      startExtensionEnableTimer();
    }
  });

  function stopTimer() {
    clearInterval(intervalId);
  }

  function startExtensionEnableTimer() {
    document.documentElement.setAttribute("untrap_global_enable", true);

    intervalId = setInterval(() => {
      browser.storage.local.get(
        [extensionEnableTimeKey, extensionEnableLastedTimeKey],
        function (obj) {
          const extensionEnableLimitDuration = obj[extensionEnableTimeKey];
          let extensionEnableLimitLastedTime =
            obj[extensionEnableLastedTimeKey];

          if (extensionEnableLimitDuration === 0) {
            stopTimer();
          } else {
            extensionEnableLimitLastedTime++;

            browser.storage.local.set({
              [getConstNotSyncing.extensionEnableLastedTime]:
                extensionEnableLimitLastedTime,
            });

            if (
              extensionEnableLimitLastedTime >=
              getSecondsFromMinutes(extensionEnableLimitDuration)
            ) {
              blockingExtension();
            }
          }
        }
      );
    }, 1000);
  }

  function blockingExtension() {
    stopTimer();

    browser.storage.local.set({
      [getConstNotSyncing.extensionIsEnabledData]: false,
    });

    browser.storage.local.set({
      [extensionEnableTimeKey]: 0,
    });

    browser.storage.local.set({
      [extensionEnableLastedTimeKey]: 0,
    });

    document.documentElement.setAttribute("untrap_global_enable", false);
  }
})();
