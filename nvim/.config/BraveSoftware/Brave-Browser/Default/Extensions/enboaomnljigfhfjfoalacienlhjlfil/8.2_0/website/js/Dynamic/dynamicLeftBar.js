(function () {
  // Auto Collapse Left Navigation Bar

  function leftBarObserverAction() {
    browser.storage.local.get(
      ["untrap_sidebar_auto_collapse_sidebar"],
      function (obj) {
        const needToCollapse = obj["untrap_sidebar_auto_collapse_sidebar"];

        if (needToCollapse == true) {
          const app = querySelector("ytd-app");

          if (app.hasAttribute("guide-persistent-and-visible")) {
            const burgerButton = querySelector(
              "ytd-app[guide-persistent-and-visible] #masthead #guide-button"
            );

            if (burgerButton) {
              burgerButton.click();
            }
          } else {
            leftBarObserver.disconnect();
          }
        }
      }
    );
  }

  var leftBarObserver = new MutationSummary({
    callback: leftBarObserverAction,
    queries: [
      {
        element: "ytd-app[guide-persistent-and-visible]",
        elementAttributes: "guide-persistent-and-visible",
      },
    ],
  });

  // Auto Expand Library

  function libraryExpanderObserverAction() {
    browser.storage.local.get(
      ["untrap_sidebar_auto_expand_playlists"],
      function (obj) {
        const needToExpandLibrary = obj["untrap_sidebar_auto_expand_playlists"];
        if (needToExpandLibrary == true) {
          const expanderButton = querySelector(
            "tp-yt-app-drawer#guide[role='navigation'] #sections #items ytd-guide-collapsible-section-entry-renderer:has(a[href*='feed/you']) #expander-item"
          );

          if (expanderButton) {
            expanderButton.click();
          } else {
            libraryExpanderObserver.disconnect();
          }
        }
      }
    );
  }

  var libraryExpanderObserver = new MutationSummary({
    callback: libraryExpanderObserverAction,
    queries: [
      {
        element: "ytd-guide-collapsible-entry-renderer[can-show-more]",
        elementAttributes: "can-show-more",
      },
    ],
  });

  // Auto Expand Subscriptions

  function subscriptionsExpanderObserverAction() {
    browser.storage.local.get(
      ["untrap_sidebar_auto_expand_subscriptions"],
      function (obj) {
        const needToExpandSubscriptions =
          obj["untrap_sidebar_auto_expand_subscriptions"];
        if (needToExpandSubscriptions == true) {
          const expanderButton =
            querySelector(
              "tp-yt-app-drawer#guide[role='navigation'] #sections ytd-guide-section-renderer:has(a[href*='feed/guide_builder']) #expander-item"
            ) ||
            querySelector(
              "tp-yt-app-drawer#guide[role='navigation'] #sections ytd-guide-section-renderer:has(a[href*='/@']) #expander-item"
            );

          if (expanderButton) {
            expanderButton.click();
          } else {
            subscriptionsExpanderObserver.disconnect();
          }
        }
      }
    );
  }

  var subscriptionsExpanderObserver = new MutationSummary({
    callback: subscriptionsExpanderObserverAction,
    queries: [
      {
        element: "ytd-guide-collapsible-entry-renderer[can-show-more]",
        elementAttributes: "can-show-more",
      },
    ],
  });
})();
