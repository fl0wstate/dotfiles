(function () {
  // MARK: - Actions

  // Click on Activate Button

  document
    .querySelectorAll("#openingTimerSetButton, #openingTimerUpdateButton")
    .forEach((element) => {
      element.onclick = function () {
        // Opening Timer Value

        const openingTimerValue = queryById("openingTimerDurationSelect").value;

        setToStorage(getConst.openingTimerValueData, openingTimerValue);

        // Opening Timer Message

        const openingTimerMessage = queryById("openingTimerMessage").value;

        setToStorage(getConst.openingTimerMessageData, openingTimerMessage);

        var selectElement = document.getElementById(
          "openingTimerDurationSelect"
        );
        var selectedOption = selectElement.options[selectElement.selectedIndex];

        setToStorage(getConst.openingTimerIsActiveData, true);

        queryById("openingTimer-bottomButtons").setAttribute("active", "");

        queryById("launchDelayState").setAttribute("active", "");
      };
    });

  // Deactivate Button

  queryById("openingTimerDestructButton").onclick = function () {
    queryById("launchDelayState").removeAttribute("active");

    setToStorage(getConst.openingTimerIsActiveData, false);

    queryById("openingTimer-bottomButtons").removeAttribute("active", "");
  };

  // Click on row with select

  const intervalItems = querySelectorAll(
    "#openingTimerScreen .modernFormBlockItemsWrapper:has(select)"
  );

  for (const index in intervalItems) {
    const item = intervalItems[index];
    item.onclick = function () {
      showDropdown(item.querySelector("select"));
    };
  }
})();
