function clearPasswordStateFull() {
  setToStorage(getConst.passwordLockingIsActiveData, false);
  setToStorage(getConst.passwordLockingPasswordData, "");
  setToStorage(getConst.passwordLockingPromptData, "");
  setToStorage(getConst.passwordLockingResetPeriodData, 9);
  setToStorage(getConst.passwordLockingResetIsActiveData, false);

  queryById("passwordProtectionStatusInfo").removeAttribute("active", "");

  queryById("differentPasswordsError").style.display = "none";
  queryById("protectPasswordTextField").classList.remove("error");
  queryById("protectPassword2TextField").classList.remove("error");
  queryById("passwordPromptTextField").value = "";
  queryById("protectPasswordTextField").value = "";
  queryById("protectPassword2TextField").value = "";

  var selectElement = document.getElementById("passwordResetPeriodSelect");

  var valueToFind = "0";

  // Loop through the options in the select element
  for (var i = 0; i < selectElement.options.length; i++) {
    var option = selectElement.options[i];

    // Check if the option's value matches the value you want to find
    if (option.value === valueToFind) {
      // Set the option as selected
      option.selected = true;
      break; // Exit the loop once the option is found and selected
    }
  }
}

(function () {
  // MARK: - Functions

  // Clear all errors and empty fields

  function clearPasswordState() {
    queryById("differentPasswordsError").style.display = "none";
    queryById("protectPasswordTextField").classList.remove("error");
    queryById("protectPassword2TextField").classList.remove("error");
  }

  // MARK: - Actions

  // Click on row with select

  const intervalItems = querySelectorAll(
    "#passwordLockingScreen .modernFormBlockItemsWrapper:has(select)"
  );

  for (const index in intervalItems) {
    const item = intervalItems[index];
    item.onclick = function () {
      showDropdown(item.querySelector("select"));
    };
  }

  // Protect Button

  document
    .querySelectorAll(
      "#passwordLockingProtectButton, #passwordLockingUpdateButton"
    )
    .forEach((element) => {
      element.onclick = function () {
        // Clean previous errors

        queryById("differentPasswordsError").style.display = "none";

        // Get text fields

        const passwordTextField = queryById("protectPasswordTextField");
        const passwordTextField2 = queryById("protectPassword2TextField");

        const passwordPromptTextField = queryById(
          "passwordPromptTextField"
        ).value;
        const passwordResetPeriodSelect = queryById(
          "passwordResetPeriodSelect"
        ).value;

        var isTestPassed = true;

        if (passwordTextField.value.length <= 0) {
          passwordTextField.classList.add("error");
          isTestPassed = false;
        }

        if (passwordTextField2.value.length <= 0) {
          passwordTextField2.classList.add("error");
          isTestPassed = false;
        }

        if (
          passwordTextField.value.length > 0 &&
          passwordTextField2.value.length > 0 &&
          passwordTextField.value != passwordTextField2.value
        ) {
          isTestPassed = false;
          queryById("differentPasswordsError").style.display = "block";
        }

        if (isTestPassed) {
          queryById("passwordProtectionStatusInfo").setAttribute("active", "");

          setToStorage(getConst.passwordLockingIsActiveData, true);
          setToStorage(
            getConst.passwordLockingPasswordData,
            passwordTextField.value
          );

          setToStorage(
            getConst.passwordLockingPromptData,
            passwordPromptTextField
          );
          setToStorage(
            getConst.passwordLockingResetPeriodData,
            passwordResetPeriodSelect
          );

          clearPasswordState();

          //

          queryById("passwordLocking-bottomButtons").setAttribute("active", "");
        }
      };
    });

  // Deactivate Button

  queryById("passwordLockingDestructButton").onclick = function () {
    clearPasswordStateFull();
    queryById("passwordLocking-bottomButtons").removeAttribute("active", "");
  };

  // Focus textfield

  const textFields = document.querySelectorAll(".textField");
  for (var i = 0; i < textFields.length; i++) {
    textFields[i].onfocus = function () {
      this.classList.remove("error");
    };
  }
})();
