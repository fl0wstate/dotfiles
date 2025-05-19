// This script determine when context menu is opened and add block buttons depends on content type

(function () {
  function removeFilterCheckAttr() {
    const contentElements = document.querySelectorAll("[filterChecked]");

    for (const element of contentElements) {
      element.removeAttribute("filterChecked");
    }
  }

  // MARK: - Add Buttons to context menu

  function setToBlock(type, rules) {
    const typeStorageConstant = BLOCK_STORAGE_CONSTANTS[type];

    browser.storage.local.get([typeStorageConstant], function (obj) {
      var data = obj[typeStorageConstant] ?? [];

      const newIdRule = rules.id;
      const newNameRule = rules.name;

      if (newIdRule != null && !data.includes(newIdRule)) {
        data.unshift(newIdRule);

        // Add to storage
        setToStorage(typeStorageConstant, data, function () {
          // Trigger block update
          removeFilterCheckAttr();
          filterYouTubeContent();
        });
      }

      if (newNameRule != null && !data.includes(newNameRule)) {
        data.unshift(newNameRule);

        // Add to storage
        setToStorage(typeStorageConstant, data, function () {
          // Trigger block update
          removeFilterCheckAttr();
          filterYouTubeContent();
        });
      }
    });
  }

  function createContextButton(type, rules, action) {
    const items =
      document.querySelector("#menu > .menu-content") ||
      document.querySelector(
        "bottom-sheet-layout .bottom-sheet-media-menu-item"
      );
    const buttonAppended = items.querySelector("[type='" + type + "']");

    // Add button if not exist yet
    if (!buttonAppended) {
      // Create Button Wrapper
      var menuServiceItemRenderer = document.createElement("div");
      menuServiceItemRenderer.setAttribute(
        "class",
        "untrapContextMenuButtonWrapper"
      );
      menuServiceItemRenderer.setAttribute("type", type);

      if (rules.id != null) {
        menuServiceItemRenderer.setAttribute("ruleID", rules.id);
      }

      if (rules.name != null) {
        menuServiceItemRenderer.setAttribute("ruleName", rules.name);
      }

      // Create Button Text
      var formattedString = document.createElement("div");
      formattedString.setAttribute("class", "formattedString");
      formattedString.textContent = BUTTON_TITLES[type];

      // Create SVG element
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block;" class="formattedIcon"><path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM3 12C3 14.31 3.87 16.41 5.29 18L18 5.29C16.41 3.87 14.31 3 12 3C7.03 3 3 7.03 3 12ZM18.71 6L6 18.71C7.59 20.13 9.69 21 12 21C16.97 21 21 16.97 21 12C21 9.69 20.13 7.59 18.71 6Z"/> <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM21 12C21 14.31 20.13 16.41 18.71 18L6 5.29C7.59 3.87 9.69 3 12 3C16.97 3 21 7.03 21 12ZM5.29 6L18 18.71C16.41 20.13 14.31 21 12 21C7.03 21 3 16.97 3 12C3 9.69 3.87 7.59 5.29 6Z"/></svg>';

      menuServiceItemRenderer.innerHTML = svg;

      menuServiceItemRenderer.onclick = function () {
        setToBlock(type, rules);

        // Remove focus
        document.activeElement.blur();

        // Hide Context Menu
        document.getElementById("untrap_settings").click();
      };

      // Append text to wrapper
      menuServiceItemRenderer.appendChild(formattedString);

      if (items.classList.contains("menu-content")) {
        items.insertAdjacentElement("afterbegin", menuServiceItemRenderer);
      } else {
        items.insertAdjacentElement("beforeend", menuServiceItemRenderer);
      }
    }
  }

  function blockChannelButton(element) {
    const channelID = getChannelID(element);
    const channelName = getChannelName(element);

    if (channelID != null || channelName != null) {
      const rules = {
        id: channelID,
        name: channelName,
      };

      createContextButton("channel", rules);
    }
  }

  function blockVideoButton(element) {
    const videoID = getVideoID(element);

    if (videoID != null) {
      const rules = {
        id: videoID,
      };

      createContextButton("video", rules);
    }
  }

  function addButtonsToContextMenu(contextMenu) {
    const element = selectedElement;

    if (element) {
      if (
        element.querySelector("a[href*='watch?v']") &&
        element.querySelector(".video-thumbnail-img")
      ) {
        blockVideoButton(element);
        blockChannelButton(element);
      }
    }
  }

  function contextMenuIsClosed(contextMenu) {
    // Add attribute
    contextMenu.setAttribute("contextMenuIsHidden", "");

    // Remove Buttons
    const buttons = document.querySelectorAll(
      ".untrapContextMenuButtonWrapper"
    );

    if (!buttons) return;

    for (const button of buttons) {
      button.remove();
    }
  }

  function contextMenuIsOpened(contextMenu) {
    // Remove attribute
    contextMenu.removeAttribute("contextMenuIsHidden");

    // Mutation to wait until popup is fully loaded and stable

    new MutationObserver(() => {
      // Check if context menu is not hidden

      if (contextMenu.hasAttribute("contextMenuIsHidden")) return;

      // Add buttons

      addButtonsToContextMenu(contextMenu);
    }).observe(contextMenu, { subtree: true, childList: true });

    // Add buttons

    addButtonsToContextMenu(contextMenu);
  }

  function reactOnChanges() {
    const contextMenu =
      document.querySelector("#menu > .menu-content") ||
      document.querySelector(
        "bottom-sheet-layout .bottom-sheet-media-menu-item"
      );

    if (!contextMenu) return;

    const bodyWithAttr =
      document.querySelector("body[modal-open-body]") ||
      document.querySelector("body[bottom-sheet-open]");

    if (bodyWithAttr) {
      contextMenuIsOpened(contextMenu);
    } else {
      contextMenuIsClosed(contextMenu);
    }
  }

  function contextMenuChangedState() {
    browser.storage.local.get(
      [
        getConst.blocklistContextMenuButtonsData,
        getConstNotSyncing.extensionIsEnabledData,
      ],
      function (obj) {
        const showContextButtons =
          obj[getConst.blocklistContextMenuButtonsData] ?? false;
        const extensionIsEnabled =
          obj[getConstNotSyncing.extensionIsEnabledData] ?? true;

        if (showContextButtons && extensionIsEnabled) {
          reactOnChanges();
        }
      }
    );
  }

  var selectedElement;

  function inialize() {
    // Context Manu show / hide observer

    var dropdownObserver = new MutationSummary({
      callback: contextMenuChangedState,
      queries: [
        // Context Menu on Desktop
        {
          element: "body",
          elementAttributes: "modal-open-body bottom-sheet-open",
        },

        // Context Menu on Mobile
      ],
    });

    // MARK: - Add Actions to More Buttons
    // Main task is to catch selected element so can show needed buttons in context menu

    document.addEventListener("click", function (event) {
      selectedElement = null;

      const element = event.target.closest(contentTags.join(", "));

      if (element) {
        selectedElement = element;
      }
    });
  }

  inialize();
})();
