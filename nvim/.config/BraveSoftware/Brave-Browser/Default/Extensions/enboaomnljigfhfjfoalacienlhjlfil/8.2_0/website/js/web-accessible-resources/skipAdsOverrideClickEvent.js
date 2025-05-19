(function () {
  "use strict";

  if (HTMLDivElement.prototype.skipAdsClickListener !== undefined) return;
  HTMLDivElement.prototype.skipAdsClickListener =
    HTMLDivElement.prototype.addEventListener;
  HTMLDivElement.prototype.addEventListener = function (
    type,
    listener,
    options
  ) {
    if (
      type === "click" &&
      typeof this === "object" &&
      this.nodeType === Node.ELEMENT_NODE &&
      this.nodeName === "DIV" &&
      this.id !== "trigger"
    ) {
      const callback = function (event) {
        const temp = {
          isTrusted: true,
          type: "click",
          bubbles: event.bubbles,
          cancelable: event.cancelable,
          composed: event.composed,
          composedPath: function () {
            return event.composedPath();
          },
          defaultPrevented: event.defaultPrevented,
          eventPhase: event.eventPhase,
          srcElement: event.srcElement,
          timeStamp: event.timeStamp,
          currentTarget: event.currentTarget,
          target: event.target,
          stopImmediatePropagation: function () {
            event.stopImmediatePropagation();
          },
          stopPropagation: function () {
            event.stopPropagation();
          },
          preventDefault: function () {
            event.preventDefault();
          },
        };
        listener(temp);
      };
      HTMLDivElement.prototype.skipAdsClickListener.call(
        this,
        type,
        callback,
        options
      );
      return;
    }
    HTMLDivElement.prototype.skipAdsClickListener.apply(this, arguments);
  };

  Object.defineProperty(HTMLDivElement.prototype.addEventListener, "name", {
    configurable: true,
    value: "addEventListener",
  });

  HTMLDivElement.prototype.addEventListener.toString = function () {
    return HTMLDivElement.prototype.skipAdsClickListener.toString();
  };

  Object.defineProperty(
    HTMLDivElement.prototype.addEventListener.toString,
    "name",
    { configurable: true, value: "toString" }
  );
})();
