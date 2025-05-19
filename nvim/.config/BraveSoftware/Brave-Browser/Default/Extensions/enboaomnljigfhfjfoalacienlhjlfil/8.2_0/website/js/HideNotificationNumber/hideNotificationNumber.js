//function initialTitleFromInit(isHideCountOfNotification) {
//  const titleElement = document.querySelector("title");
//
//  if (titleElement && isHideCountOfNotification) {
//    titleElement.textContent = titleElement.textContent.replace(
//      /^\(\d+\)\s*/,
//      ""
//    );
//  }
//}
//
//function observeTitle(isHideCountOfNotification) {
//  const titleElement = document.querySelector("title");
//
//  new MutationObserver(() =>
//    initialTitleFromInit(isHideCountOfNotification)
//  ).observe(titleElement, {
//    childList: true,
//  });
//}
//
//if (!isBrowserSafari()) {
//  document.addEventListener("DOMContentLoaded", () => {
//    browser.storage.local.get(
//      [
//        getConstNotSyncing.extensionIsEnabledData,
//        "untrap_header_hide_notifications_counter",
//      ],
//      function (obj) {
//        const extensionIsEnabled =
//          obj[getConstNotSyncing.extensionIsEnabledData] ?? true;
//        const isHideCountOfNotification =
//          obj["untrap_header_hide_notifications_counter"];
//
//        if (extensionIsEnabled && isHideCountOfNotification) {
//          observeTitle(isHideCountOfNotification);
//        }
//      }
//    );
//  });
//}
