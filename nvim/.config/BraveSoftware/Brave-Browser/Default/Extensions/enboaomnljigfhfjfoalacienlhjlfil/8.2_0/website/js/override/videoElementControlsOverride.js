(function () {
  Object.defineProperty(HTMLVideoElement.prototype, "controls", {
    configurable: true,
    enumerable: true,
    get() {
      return this.getAttribute("controls") !== null;
    },
    set(value) {
      if (value) {
        this.setAttribute("controls", "");
      } else {
        this.removeAttribute("controls");
      }
    },
  });
})();
