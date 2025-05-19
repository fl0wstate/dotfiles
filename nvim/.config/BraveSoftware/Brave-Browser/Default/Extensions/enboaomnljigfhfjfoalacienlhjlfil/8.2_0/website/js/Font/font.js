function setFont() {
  function removeOldFont() {
    const fontLink = document.querySelector(".untrapFontLink");

    if (fontLink) {
      fontLink.remove();
    }

    const fontStyle = document.querySelector(".untrapFontStyle");

    if (fontStyle) {
      fontStyle.remove();
    }
  }

  // Generate new filter styles
  browser.storage.local.get(["untrap_appearance_font"], function (obj) {
    const fontToSet = obj["untrap_appearance_font"] ?? "default";

    if (fontToSet != "default") {
      removeOldFont();

      const fontLink = document.createElement("link");
      fontLink.classList.add("untrapFontLink");
      fontLink.rel = "stylesheet";
      fontLink.href = "//fonts.googleapis.com/css2?family=" + fontToSet;

      const fontStyle = document.createElement("style");
      fontStyle.classList.add("untrapFontStyle");
      fontStyle.textContent = '*{font-family:"' + fontToSet + '" !important}';

      document.head.appendChild(fontLink);
      document.head.appendChild(fontStyle);
    } else {
      removeOldFont();
    }
  });
}

setFont();
