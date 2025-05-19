// MARK: - Launch Blocking

function scheduleBlockExtension(days, times) {
  var stringToDisplay = days.join(", ");

  if (times.length > 1) {
    stringToDisplay += "<br>" + times[0].from + " - " + times[0].to;
    stringToDisplay += "<br>" + times[1].from + " - " + times[1].to;
  } else {
    stringToDisplay += "<br>" + times[0].from + " - " + times[0].to;
  }

  queryById("scheduleBlockingDaysSpan").innerHTML = stringToDisplay;
  showScreen("scheduleLockedScreen");
}

function temporaryBlockExtension(finishDate) {
  const day = addZeroPrefix(finishDate.getDate());
  const month = addZeroPrefix(finishDate.getMonth() + 1);
  const year = finishDate.getFullYear();
  const hours = addZeroPrefix(finishDate.getHours());
  const minutes = addZeroPrefix(finishDate.getMinutes());

  var stringToDisplay =
    hours + ":" + minutes + " " + day + "." + month + "." + year;

  queryById("tempBlockingSpan").innerHTML = stringToDisplay;
  showScreen("temporaryLockedScreen");
}

function stopTemporaryBlocking() {
  setToStorage(
    getConst.youtubeBlockingTemporaryIsActiveData,
    false,
    function () {
      queryById("youtubeBlockingTemporary-bottomButtons").removeAttribute(
        "active"
      );
    }
  );
}

// MARK: - Check if Need to Block

function checkIfBlockedScheduled() {
  browser.storage.local.get(
    [
      getConst.youtubeBlockingScheduleIsActiveData,
      getConst.youtubeBlockingScheduleBlockExtensionData,
      getConst.youtubeBlockingScheduleDaysData,
      getConst.youtubeBlockingScheduleTimeIntervalsData,
    ],
    function (obj) {
      const scheduleBlockingActive =
        obj[getConst.youtubeBlockingScheduleIsActiveData] ?? false;
      const shouldBlockExtension =
        obj[getConst.youtubeBlockingScheduleBlockExtensionData] ?? false;

      if (scheduleBlockingActive && shouldBlockExtension) {
        // Check by blocking days

        const currentTime = new Date();
        const blockingDays = obj[getConst.youtubeBlockingScheduleDaysData];
        const currentDayOfWeek = DAYS[currentTime.getDay()];

        if (blockingDays.includes(currentDayOfWeek)) {
          // Check by time intervals

          const blockedIntervals =
            obj[getConst.youtubeBlockingScheduleTimeIntervalsData] ?? [];

          blockedIntervals.some((interval) => {
            const fromTimeString =
              currentTime.toDateString() + " " + interval.from;
            const toTimeString = currentTime.toDateString() + " " + interval.to;

            let fromTime = new Date(fromTimeString);
            let toTime = new Date(toTimeString);

            if (toTime < fromTime) {
              // Another Day like 23:00 to 13:00
              if (currentTime <= toTime) {
                scheduleBlockExtension(blockingDays, blockedIntervals);
              }
            } else {
              if (currentTime >= fromTime && currentTime <= toTime) {
                scheduleBlockExtension(blockingDays, blockedIntervals);
              }
            }
          });
        }
      }
    }
  );
}

function checkIfBlockedTemporary() {
  browser.storage.local.get(
    [
      getConst.youtubeBlockingTemporaryIsActiveData,
      getConst.youtubeBlockingTemporaryDurationData,
      getConst.youtubeBlockingTemporaryBlockExtensionData,
      getConst.youtubeBlockingTemporaryStartDateData,
    ],
    function (obj) {
      const temporaryBlockingIsActive =
        obj[getConst.youtubeBlockingTemporaryIsActiveData];
      const shouldBlockExtension =
        obj[getConst.youtubeBlockingTemporaryBlockExtensionData];

      if (temporaryBlockingIsActive == true && shouldBlockExtension == true) {
        const currentDate = new Date();
        const startDate = new Date(
          obj[getConst.youtubeBlockingTemporaryStartDateData]
        );
        const duration = obj[getConst.youtubeBlockingTemporaryDurationData];

        const finishDate = addSeconds(startDate, duration);

        if (currentDate < finishDate) {
          temporaryBlockExtension(finishDate);
        } else {
          stopTemporaryBlocking();
        }
      }
    }
  );
}

function checkIfBlockedByPassword() {
  browser.storage.local.get(
    [
      getConst.passwordLockingIsActiveData,
      getConst.passwordLockingResetFinalDateData,
      getConst.passwordLockingResetIsActiveData,
      getConst.passwordLockingResetPeriodData,
    ],
    function (obj) {
      const currentDate = new Date();

      const lockingIsActive =
        obj[getConst.passwordLockingIsActiveData] ?? false;

      const passwordLockingResetPeriod =
        obj[getConst.passwordLockingResetPeriodData] ?? 9;
      const passwordLockingResetFinalDate =
        obj[getConst.passwordLockingResetFinalDateData] ?? currentDate;
      const passwordLockingResetIsActive =
        obj[getConst.passwordLockingResetIsActiveData] ?? false;

      if (lockingIsActive == false) {
        showScreen("mainScreen");
      } else {
        if (passwordLockingResetIsActive) {
          const normalPasswordLockingResetFinalDate = new Date(
            passwordLockingResetFinalDate
          );

          if (currentDate < normalPasswordLockingResetFinalDate) {
            showScreen("passwordUnlockingScreen");
          } else {
            // Reset Password

            clearPasswordStateFull();

            showScreen("mainScreen");
          }
        } else {
          showScreen("passwordUnlockingScreen");
        }
      }
    }
  );
}

function startTimer(totalSeconds, actionCallback) {
  let secondsElapsed = 0;

  const timerInterval = setInterval(function () {
    if (secondsElapsed >= totalSeconds) {
      clearInterval(timerInterval); // Stop the timer when N seconds have elapsed
    } else {
      secondsElapsed++;
      actionCallback(secondsElapsed);
    }
  }, 1000);
}

function checkIfBlockedByOpeningTimer() {
  browser.storage.local.get(
    [
      getConst.openingTimerIsActiveData,
      getConst.openingTimerValueData,
      getConst.openingTimerMessageData,
    ],
    function (obj) {
      const openingTimerIsActive =
        obj[getConst.openingTimerIsActiveData] ?? false;
      const openingTimerValue = obj[getConst.openingTimerValueData] ?? 1;
      const openingTimerMessage = obj[getConst.openingTimerMessageData] ?? "";

      if (openingTimerIsActive == true) {
        if (openingTimerMessage == "") {
          queryById("openingTimerMessageDisplay").style.display = "none";
          queryById("openingTimerMessageDisplay").innerHTML = "";
        } else {
          queryById("openingTimerMessageDisplay").style.display = "block";
          queryById("openingTimerMessageDisplay").innerHTML =
            openingTimerMessage;
        }

        queryById("openingTimerLeftSeconds").innerHTML = openingTimerValue;

        showScreen("openingTimerWaitScreen");

        startTimer(openingTimerValue, function (secondsElapsed) {
          const leftSeconds = openingTimerValue - secondsElapsed;

          if (leftSeconds == 0) {
            otherChecks();
          } else {
            queryById("openingTimerLeftSeconds").innerHTML = leftSeconds;
          }
        });
      }
    }
  );
}

// MARK: - Life Cycle

function otherChecks() {
  checkIfBlockedByPassword();
  checkIfBlockedTemporary();
  checkIfBlockedScheduled();
}

function checkIfNeedToBlockExtension() {
  browser.storage.local.get(
    [getConst.openingTimerIsActiveData],
    function (obj) {
      const openingTimerIsActive =
        obj[getConst.openingTimerIsActiveData] ?? false;

      if (openingTimerIsActive == true) {
        checkIfBlockedByOpeningTimer();
      } else {
        otherChecks();
      }
    }
  );
}

checkIfNeedToBlockExtension();
