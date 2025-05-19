(function () {
  // MARK: - Category Picker

  queryById("activeCategoryButton").onclick = function () {
    var isShowing = queryById("optionsScreen").getAttribute(
      "categoryPickerIsShowing"
    );
    queryById("optionsScreen").setAttribute(
      "categoryPickerIsShowing",
      isShowing == "false"
    );
  };

  // MARK: - Search

  // Back Button Click

  document.querySelector(
    "#optionsScreen .subScreenNavigation .backButton"
  ).onclick = function () {
    disableSearchMode();
  };

  // Show SearchField

  queryById("showSearchButton").onclick = function () {
    const searchElement = document.querySelector("#optionsScreen #search");
    searchElement.style.display = "block";
    searchElement.style.marginTop = "20px";
    this.style.display = "none";
  };

  // Methods

  function findOptionsByQuery(searchQuery) {
    queryById("settingsContainerSearch").innerHTML = "";

    // Get all options

    const allOptions = getAllOptions(ACTUAL_CATEGORIES);

    // Leave only options that contains search terms

    const filteredOptions = searchOptions(allOptions, searchQuery);

    if (filteredOptions.length > 0) {
      // Recreate Cascade Array

      const recreatedActualCategory = recreateCascadeStructure(filteredOptions);

      // Show It Through function generateSettingsController

      generateSettingsController(recreatedActualCategory, true);
    } else {
      // Show nothing was found

      queryById("searchMessage").style.display = "block";
    }
  }

  function activateSearchMode(searchQuery) {
    queryById("optionsScreen").setAttribute("search_mode", "");
    findOptionsByQuery(searchQuery);
  }

  function disableSearchMode() {
    queryById("optionsScreen").removeAttribute("search_mode");
    queryById("searchField").value = "";
    queryById("settingsContainerSearch").innerHTML = "";
    queryById("searchMessage").style.display = "none";
    generateSettingsController(ACTUAL_CATEGORIES, false);

    var scrollableDiv = document.getElementById("settingsContainer");
    scrollableDiv.scrollTop = 0;
  }

  // Typed in SearchField

  let typingTimer; // Timer identifier
  const doneTypingInterval = 500; // Time in milliseconds (adjust as needed)

  queryById("searchField").onkeyup = function () {
    clearTimeout(typingTimer); // Clear the previous timer (if exists)

    const searchQuery = queryById("searchField").value;
    typingTimer = setTimeout(function () {
      queryById("searchMessage").style.display = "none";
      const searchQuery = queryById("searchField").value;
      if (searchQuery.length == 0) {
        disableSearchMode();
      } else {
        activateSearchMode(searchQuery);
      }
    }, doneTypingInterval);
  };

  // Clear SearchField

  queryById("clearSearch").onclick = function () {
    disableSearchMode();
  };
})();
