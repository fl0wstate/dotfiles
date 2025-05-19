var activeTabId = 0;

// MARK: - Helpers

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);

  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// MARK: - Functions

// Remove leading symbols in string

function removeLeadingAtSymbols(inputString) {
  return inputString.replace(/^@+/, "");
}

// Clear field state

function clearFieldState() {
  queryById("contentFilterField").classList.remove("error");
  queryById("contentFilterField").value = "";
}

// Remove active state from all tabs

function makeUnactiveAllTabs() {
  const filterTabs = document.querySelectorAll(
    "#contentFilterScreen .segmentedPicker .option"
  );

  for (const tab of filterTabs) {
    tab.removeAttribute("active");
  }
}

// Set label and placeholder

function setLabelAndPlaceholder() {
  const activeTab = document.querySelector(
    "#contentFilterScreen .segmentedPicker .option[data-id='" +
      activeTabId +
      "']"
  );

  document
    .getElementById("contentFilterField")
    .setAttribute("placeholder", activeTab.getAttribute("data-input"));
}

// Get storage constant by current tab

function getCurrentTabStorageName() {
  if (activeTabId == 0) {
    return getConst.filterChannelsRulesData;
  } else if (activeTabId == 1) {
    return getConst.filterVideosRulesData;
  } else if (activeTabId == 2) {
    return getConst.filterCommentsRulesData;
  } else if (activeTabId == 3) {
    return getConst.filterPostsRulesData;
  }
}

// Present list of rules

function presentRulesListInUI(rules) {
  var listOfRules = "";

  rules.forEach((item, index) => {
    if (index === rules.length - 1) {
      listOfRules += item;
    } else {
      listOfRules += item + "\n";
    }
  });

  querySelector("#contentFilterScreen .filterRulesWrapper").value = listOfRules;
}

// Present rules for specific type

function presentTabRules() {
  browser.storage.local.get(getCurrentTabStorageName(), function (obj) {
    const data = obj[getCurrentTabStorageName()] ?? [];

    querySelector("#contentFilterScreen .filterRulesWrapper").value = "";

    if (data.length != 0) {
      presentRulesListInUI(data);
    }
  });
}

// Tabs click: Channels, Videos, Comments, Posts

const filterTabs = document.querySelectorAll(
  "#contentFilterScreen .segmentedPicker .option"
);

for (const tab of filterTabs) {
  tab.onclick = function () {
    makeUnactiveAllTabs();
    clearFieldState();
    this.setAttribute("active", "");
    activeTabId = this.getAttribute("data-id");
    document
      .getElementById("contentFilterField")
      .setAttribute("placeholder", this.getAttribute("data-input"));
    presentTabRules();
  };
}

// Try to extract link

const extractionFunctions = {
  0: extractChannelId,
  1: extractVideoId,
  2: extractCommentID,
  3: extractPostID,
};

// Add Rule

queryById("contentFilterFieldAddButton").onclick = function () {
  var textFieldValue = queryById("contentFilterField").value.trim();

  if (textFieldValue.replaceAll(" ", "").length == 0) {
    queryById("contentFilterField").classList.add("error");
  } else {
    var error = false;

    if (
      textFieldValue.includes("youtube.com/") &&
      extractionFunctions.hasOwnProperty(activeTabId)
    ) {
      const extracted = extractionFunctions[activeTabId](textFieldValue);
      if (extracted) {
        textFieldValue = extracted;
      } else {
        queryById("contentFilterField").classList.add("error");
        error = true;
      }
    }

    if (activeTabId == 0) {
      if (textFieldValue.substring(0, 1) == "@") {
        textFieldValue = removeLeadingAtSymbols(textFieldValue);
      }
    }

    if (!error) {
      const currentTab = getCurrentTabStorageName();

      browser.storage.local.get(currentTab, function (obj) {
        var data = obj[currentTab] ?? [];

        if (!data.includes(textFieldValue)) {
          data.unshift(textFieldValue);

          // Add to storage
          setToStorage(currentTab, data, function () {
            // Update HTML
            presentTabRules();

            // Update counter on more screen
            getFiltersStatus();
          });
        }
      });
    }
  }

  queryById("contentFilterField").value = "";
};

// Tap on Save button

querySelector(".saveTextareaButton").onclick = function () {
  // Hide save button
  querySelector(".saveTextareaButton").style.display = "none";
  // Save to storage all unique values from textarea
  const currentTab = getCurrentTabStorageName();

  if (!textareaValue.trim()) {
    setToStorage(currentTab, [], function () {
      presentTabRules();
      getFiltersStatus();
    });
    return;
  }

  const lines = querySelector(".filterRulesWrapper")
    .value.split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const uniqueLines = [];
  const uniqueLinesSet = new Set();

  if (lines.length === 0) {
    setToStorage(currentTab, [], function () {
      presentTabRules();
      getFiltersStatus();
    });
    return;
  }

  lines.forEach((line) => {
    var returnLine = line;

    if (
      returnLine.includes("youtube.com/") &&
      extractionFunctions.hasOwnProperty(activeTabId)
    ) {
      const extracted = extractionFunctions[activeTabId](returnLine);
      if (extracted) {
        returnLine = extracted;
      }
    }

    if (!uniqueLinesSet.has(returnLine)) {
      uniqueLines.push(returnLine);
      uniqueLinesSet.add(returnLine);
    }
  });

  setToStorage(currentTab, uniqueLines, function () {
    presentTabRules();

    // Update counter on more screen
    getFiltersStatus();
  });
};

// Textarea is changed

querySelector(".filterRulesWrapper").addEventListener("input", function () {
  querySelector(".saveTextareaButton").style.display = "block";
});

// Tap on enable filtration

queryById("blocklistFilterEnableFilter").onclick = function () {
  const button = queryById("blocklistFilterEnableFilter").checked;

  setToStorage(getConst.filterIsEnabledData, button, function () {
    if (button) {
      queryById("channelsVideosFilterCounter").setAttribute("active", "");
    } else {
      queryById("channelsVideosFilterCounter").removeAttribute("active", "");
    }
  });
};

// Tap on add buttons to context menu

queryById("blocklistFilterContextButtons").onclick = function () {
  const button = queryById("blocklistFilterContextButtons").checked;

  setToStorage(
    getConst.blocklistContextMenuButtonsData,
    button,
    function () {}
  );
};
