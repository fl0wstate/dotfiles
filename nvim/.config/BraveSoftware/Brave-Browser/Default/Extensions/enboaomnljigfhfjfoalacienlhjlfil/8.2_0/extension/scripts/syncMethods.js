// MARK: - Fetch From Server

// Sync from server if outdated

function setOptionsFromString(options) {
  const optionsObjectsArray = JSON.parse(options);

  for (object of optionsObjectsArray) {
    const objID = object.id;
    const objValue = object.value;

    setToStorageWithoutSync(objID, objValue);
  }
}

function tryToSyncFromServer() {
  browser.storage.local.get(
    getConstNotSyncing.isCloudSyncingData,
    function (obj) {
      const isCloudSyncing =
        obj[getConstNotSyncing.isCloudSyncingData] ?? "off";

      if (
        app_isPRO == "true" &&
        app_isLogin == "true" &&
        isCloudSyncing == "on"
      ) {
        // Detect if Desktop or Mobile

        const containsMobileId = getAllOptions(ACTUAL_CATEGORIES).some(
          (obj) => obj.id === "untrap_home_mobile_hide_explore_button"
        );

        var fields = [];

        if (containsMobileId) {
          fields = [
            "untrap_LastSettingsModified",
            "untrap_FeaturesSettings",
            "untrap_MobileSettings",
          ];
        } else {
          fields = [
            "untrap_LastSettingsModified",
            "untrap_FeaturesSettings",
            "untrap_DesktopSettings",
          ];
        }

        // Fetch neccessary data from server

        browser.storage.local.get(
          [
            getConstNotSyncing.pro_usernameData,
            getConstNotSyncing.pro_passwordData,
            getConstNotSyncing.lastSyncingDateData,
          ],
          function (obj) {
            const username = obj[getConstNotSyncing.pro_usernameData] ?? "";
            const password = obj[getConstNotSyncing.pro_passwordData] ?? "";

            serverFetchSettings(username, password, fields)
              .then((result) => {
                // Check by last synced data

                const lastSync =
                  obj[getConstNotSyncing.lastSyncingDateData] ?? "0";

                if (
                  Number(result.untrap_LastSettingsModified) > Number(lastSync)
                ) {
                  // Set data from storage to current

                  if (result.untrap_MobileSettings != null) {
                    setOptionsFromString(result.untrap_MobileSettings);
                  }

                  if (result.untrap_FeaturesSettings != null) {
                    setOptionsFromString(result.untrap_FeaturesSettings);
                  }

                  if (result.untrap_DesktopSettings != null) {
                    setOptionsFromString(result.untrap_DesktopSettings);
                  }

                  // Reload PopUp

                  let date = Date.now();
                  let lastSync = date.toString();

                  setToStorageWithoutSync(
                    getConstNotSyncing.lastSyncingDateData,
                    lastSync,
                    function () {
                      location.reload();
                    }
                  );
                }
              })
              .catch((error) => {
                // Handle errors here
              });
          }
        );
      }
    }
  );
}

// MARK: - Update on Server

function updateSettingsStringInCloud() {
  if (app_isPRO == "true") {
    var mobileSettings = "";
    var desktopSettings = "";
    var featuresSettings = "";

    let date = Date.now();
    let lastModified = date.toString();

    browser.storage.local.get(
      [
        getConstNotSyncing.isCloudSyncingData,
        getConstNotSyncing.pro_usernameData,
        getConstNotSyncing.pro_passwordData,
        ...getFeaturesArrayOfObjectIds(),
      ],
      function (obj) {
        const username = obj[getConstNotSyncing.pro_usernameData] ?? "";
        const password = obj[getConstNotSyncing.pro_passwordData] ?? "";

        const isCloudSyncing =
          obj[getConstNotSyncing.isCloudSyncingData] ?? "off";

        if (isCloudSyncing == "on") {
          // Collect features list

          let featuresArrayOfObjects = [];

          for (featureObject of getFeaturesArrayOfObjectIds()) {
            const id = featureObject;
            const value = obj[featureObject];

            featuresArrayOfObjects.push({ id: id, value: value });
          }

          featuresSettings = JSON.stringify(featuresArrayOfObjects);

          // Collect options string

          let arrayOfOptionsIds = [];

          for (checkbox of getAllOptions(ACTUAL_CATEGORIES)) {
            arrayOfOptionsIds.push(checkbox.id);
          }

          browser.storage.local.get(arrayOfOptionsIds, function (obj) {
            let optionsArrayOfObjects = [];
            let isMobileOptions = false;

            for (optionsObject of arrayOfOptionsIds) {
              const id = optionsObject;
              const value = obj[optionsObject];

              optionsArrayOfObjects.push({ id: id, value: value });

              if (id == "untrap_home_mobile_hide_explore_button") {
                isMobileOptions = true;
              }
            }

            if (isMobileOptions) {
              mobileSettings = JSON.stringify(optionsArrayOfObjects);
            } else {
              desktopSettings = JSON.stringify(optionsArrayOfObjects);
            }

            // Send to server

            serverUpdateSettings(
              username,
              password,
              featuresSettings,
              desktopSettings,
              mobileSettings,
              lastModified
            )
              .then((result) => {
                if (result == "Updated") {
                  setToStorageWithoutSync(
                    getConstNotSyncing.lastSyncingDateData,
                    lastModified,
                    function () {}
                  );
                }
              })
              .catch((error) => {
                // Handle errors here
              });
          });
        }
      }
    );
  }
}
