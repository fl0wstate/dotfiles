function encodeString(input) {
  let encoded = "";
  for (let i = 0; i < input.length; i++) {
    // Get the character code for the current character
    const charCode = input.charCodeAt(i);

    // Encode the character code and append it to the result
    encoded += String.fromCharCode(charCode + 1);
  }
  return encoded;
}

function decodeString(encoded) {
  let decoded = "";
  for (let i = 0; i < encoded.length; i++) {
    // Get the character code for the current character
    const charCode = encoded.charCodeAt(i);

    // Decode the character code and append it to the result
    decoded += String.fromCharCode(charCode - 1);
  }
  return decoded;
}

function createStringWithSettings() {
  var featuresArrayOfObjectIds = [...getFeaturesArrayOfObjectIds()];

  // Iterate Through All Options and Radios and collect ids

  for (checkbox of getAllOptions(ACTUAL_CATEGORIES)) {
    featuresArrayOfObjectIds.push(checkbox.id);
  }

  browser.storage.local.get(featuresArrayOfObjectIds, function (obj) {
    const arrayOfObjects = [];

    for (additionalObject of featuresArrayOfObjectIds) {
      const encodedID = additionalObject;
      const encodedValue = obj[additionalObject];

      arrayOfObjects.push({ id: encodedID, value: encodedValue });
    }

    // Convert the array to a JSON string
    const jsonString = JSON.stringify(arrayOfObjects);

    if (queryById("exportedSettings")) {
      queryById("exportedSettings").textContent = jsonString;
    } else {
      // Create div and place info inside it
      const newDiv = document.createElement("div");

      // Optionally, you can set attributes, properties, or add content to the div
      newDiv.id = "exportedSettings"; // Set the id attribute
      newDiv.textContent = encodeString(jsonString); // Set the text content
      newDiv.style.display = "none";

      // Append the div to the body of the document (or any other element you want)
      document.body.appendChild(newDiv);
    }
  });
}

(function () {
  // MARK: - Actions

  // Tapped Export

  function exportSettings() {
    const exortedSettingsString = queryById("exportedSettings").innerHTML;

    navigator.clipboard.writeText(exortedSettingsString).then(() => {
      queryById("exportSettingsButton").innerHTML =
        "Settings Copied to Clipboard!";
      setTimeout(function () {
        queryById("exportSettingsButton").innerHTML = "Export";
      }, 4000);
    });
  }

  queryById("exportSettingsButton").onclick = function () {
    exportSettings();
  };

  // Tapped Import

  function importSettings() {
    const importTextfieldValue = queryById(
      "importSettingsTextField"
    ).value.trim();

    if (importTextfieldValue == "") {
      queryById("importSettingsTextField").classList.add("error");
    } else {
      let parsedSettings;
      try {
        parsedSettings = JSON.parse(decodeString(importTextfieldValue));

        for (const object of parsedSettings) {
          const objID = object.id;
          const objValue = object.value;

          if (objID != null && objValue != null) {
            setToStorage(objID, objValue);
            needToUpdate = true;
          }
        }

        if (needToUpdate == true) {
          location.reload();
        }
      } catch {
        queryById("importSettingsTextField").classList.add("error");
        queryById("importSettingsTextField").value = "";
      }
    }
  }

  queryById("importSettingsButton").onclick = function () {
    importSettings();
  };

  // Tapped Reset

  function resetSettings() {
    var arrayOfIds = [
      ...getFeaturesArrayOfObjectIds(),
      ...getSupportedArrayOfObjectIds(),
    ];

    for (checkbox of getAllOptions(ACTUAL_CATEGORIES)) {
      arrayOfIds.push(checkbox.id);
    }

    browser.storage.local.remove(arrayOfIds);

    location.reload();
  }

  queryById("resetSettingsButton").onclick = function () {
    resetSettings();
  };
})();
