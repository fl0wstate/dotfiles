(function () {
  // MARK: - Actions

  // Click on row with select

  const intervalItems = querySelectorAll(
    "#youtubeBlockingTemporaryScreen .modernFormBlockItemsWrapper:has(select)"
  );

  for (const index in intervalItems) {
    const item = intervalItems[index];
    item.onclick = function () {
      showDropdown(item.querySelector("select"));
    };
  }

  // Click on set temporary blocking

  function collectAllDataToStorage() {
    // Start Date and Time

    const currentDate = new Date();

    setToStorage(getConst.youtubeBlockingTemporaryStartDateData, currentDate.toISOString());

    // Duration

    const duration = queryById("temporaryBlockingDuration").value;

    setToStorage(getConst.youtubeBlockingTemporaryDurationData, duration);

    // Block Extension Checkbox

    const blockExtensionCheckbox = queryById(
      "youtubeBlockingTemporaryBlockExtensionCheckbox"
    ).checked;

    setToStorage(
      getConst.youtubeBlockingTemporaryBlockExtensionData,
      blockExtensionCheckbox
    );

    // Set active status

    setToStorage(getConst.youtubeBlockingTemporaryIsActiveData, true);
  }

  // Click on start temporary blocking

  document
    .querySelectorAll(
      "#youtubeBlockingTemporaryUpdateButton, #startTemporaryBlockSession"
    )
    .forEach((element) => {
      element.onclick = function () {
        collectAllDataToStorage();
        checkIfBlockedTemporary();

        queryById("youtubeBlockingTemporary-bottomButtons").setAttribute(
          "active",
          ""
        );

        queryById("youtubeFocusBlockingStatusInfo").setAttribute("active", "");
      };
    });

  // Click on deactivate blocking

  queryById("youtubeBlockingTemporaryDestructButton").onclick = function () {
    stopTemporaryBlocking();

    queryById("youtubeBlockingTemporary-bottomButtons").removeAttribute(
      "active",
      ""
    );

    queryById("youtubeFocusBlockingStatusInfo").removeAttribute("active", "");
  };
})();
