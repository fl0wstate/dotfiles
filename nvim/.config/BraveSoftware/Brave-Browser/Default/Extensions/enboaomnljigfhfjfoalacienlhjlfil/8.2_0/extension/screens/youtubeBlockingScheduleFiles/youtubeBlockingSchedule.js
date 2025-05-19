(function () {
  // MARK: - Actions

  // Click on row with select

  const intervalItems = querySelectorAll(
    "#youtubeBlockingScheduleScreen .intervalItem"
  );

  for (const index in intervalItems) {
    const item = intervalItems[index];
    item.onclick = function () {
      showDropdown(item.querySelector("select"));
    };
  }

  // Click add additional interval

  queryById("addAdditionalInterval").onclick = function () {
    queryById("additionalIntervalRow").style.display = "flex";
    queryById("addAdditionalInterval").style.display = "none";
  };

  // Click remove additional interval

  queryById("deleteAdditionalInterval").onclick = function () {
    queryById("additionalIntervalRow").style.display = "none";
    queryById("addAdditionalInterval").style.display = "flex";
  };

  // Change interval time select

  const intervalSelects = querySelectorAll(
    "#youtubeBlockingScheduleScreen .intervalItem select"
  );

  for (var i = 0; i < intervalSelects.length; i++) {
    const select = intervalSelects[i];
    select.onchange = function () {
      const firstFrom = queryById("scheduleTimesFirstSelectFrom").value;
      const firstTo = queryById("scheduleTimesFirstSelectTo").value;
      const secondFrom = queryById("scheduleTimesSecondSelectFrom").value;
      const secondTo = queryById("scheduleTimesSecondSelectTo").value;
    };
  }

  // Click on set schedule

  function collectAllDataToStorage() {
    // Time Intervals

    const timeIntervals = [];

    const firstIntervalFrom = queryById("scheduleTimesFirstSelectFrom").value;
    const firstIntervalTo = queryById("scheduleTimesFirstSelectTo").value;

    timeIntervals.push({ from: firstIntervalFrom, to: firstIntervalTo });

    // Second Time Interval Data

    if (queryById("additionalIntervalRow").style.display == "flex") {
      const secondIntervalFrom = queryById(
        "scheduleTimesSecondSelectFrom"
      ).value;
      const secondIntervalTo = queryById("scheduleTimesSecondSelectTo").value;

      timeIntervals.push({ from: secondIntervalFrom, to: secondIntervalTo });
    }

    setToStorage(
      getConst.youtubeBlockingScheduleTimeIntervalsData,
      timeIntervals
    );

    // Days

    var daysArray = [];

    const daysButtons = document.querySelectorAll(
      "#scheduleDaysWrapper .scheduleDay"
    );

    for (var i = 0; i < daysButtons.length; i++) {
      const dayButt = daysButtons[i];

      if (dayButt.classList.contains("active")) {
        daysArray.push(dayButt.getAttribute("day-id"));
      }
    }

    setToStorage(getConst.youtubeBlockingScheduleDaysData, daysArray);

    // Block Extension Checkbox

    const blockExtensionCheckbox = queryById(
      "youtubeBlockingScheduleBlockExtensionCheckbox"
    ).checked;

    setToStorage(
      getConst.youtubeBlockingScheduleBlockExtensionData,
      blockExtensionCheckbox
    );
  }

  document
    .querySelectorAll(
      "#youtubeBlockingScheduleSetBlocking, #youtubeBlockingScheduleUpdateButton"
    )
    .forEach((element) => {
      element.onclick = function () {
        setToStorage(
          getConst.youtubeBlockingScheduleIsActiveData,
          true,
          function () {
            collectAllDataToStorage();
            checkIfBlockedScheduled();

            queryById("youtubeBlockingSchedule-bottomButtons").setAttribute(
              "active",
              ""
            );

            queryById("youtubeScheduleBlockingStatusInfo").setAttribute(
              "active",
              ""
            );
          }
        );
      };
    });

  // Click on remove schedule

  queryById("youtubeBlockingScheduleDestructButton").onclick = function () {
    setToStorage(
      getConst.youtubeBlockingScheduleIsActiveData,
      false,
      function () {
        queryById("youtubeBlockingSchedule-bottomButtons").removeAttribute(
          "active",
          ""
        );

        queryById("youtubeScheduleBlockingStatusInfo").removeAttribute(
          "active",
          ""
        );
      }
    );
  };
})();
