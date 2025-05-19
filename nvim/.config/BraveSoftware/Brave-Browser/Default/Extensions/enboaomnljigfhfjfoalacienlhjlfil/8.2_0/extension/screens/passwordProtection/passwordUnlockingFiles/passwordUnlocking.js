(function () {
  // MARK: - Functions

  // Clear password textfield

  function clearPasswordField() {
    queryById("unlockPasswordTextField").classList.remove("error");
    queryById("unlockPasswordTextField").value = "";
  }

  // MARK: - Actions

  // Unlock with special code

  function generateUniqueCode() {
    const date = new Date();

    // Get year and month
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getUTCMonth() returns zero-based month

    // Create the unique code in the format YYYYMM
    const uniqueCode = `${year}${month}`;

    // Transform to letter code
    const letterCode = transformToLetterCode(uniqueCode);

    return letterCode;
  }

  // Function to transform to letter code
  function transformToLetterCode(code) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letterCode = "";

    for (let i = 0; i < code.length; i++) {
      const digit = parseInt(code[i], 10);
      letterCode += letters[digit];
    }

    return letterCode;
  }

  // Unlock Button Tapped

  queryById("unlockButton").onclick = function () {
    const enteredPassword = queryById("unlockPasswordTextField").value;

    if (enteredPassword.length != 0) {
      browser.storage.local.get(
        getConst.passwordLockingPasswordData,
        function (obj) {
          const data = obj[getConst.passwordLockingPasswordData];

          if (data != null) {
            if (
              data == enteredPassword ||
              enteredPassword == generateUniqueCode()
            ) {
              showScreen("mainScreen");

              setToStorage(getConst.passwordLockingResetIsActiveData, false);

              clearPasswordField();
            } else {
              queryById("wrongPasswordError").style.display = "block";
              queryById("unlockPasswordTextField").value = "";
              queryById("unlockPasswordTextField").classList.add("error");
            }
          }
        }
      );
    } else {
      queryById("unlockPasswordTextField").classList.add("error");
    }
  };

  // Show Prompt Button Tapped

  queryById("passwordUnlockingShowPromptButton").onclick = function () {
    browser.storage.local.get(
      getConst.passwordLockingPromptData,
      function (obj) {
        const prompt = obj[getConst.passwordLockingPromptData] ?? "";

        if (prompt != "") {
          queryById("passwordUnlockingPromptDisplaying").innerHTML = prompt;
          queryById("passwordUnlockingPromptDisplaying").style.display =
            "block";
          queryById("passwordUnlockingShowPromptButton").classList.add(
            "invisible"
          );
        }
      }
    );
  };

  // Focus textfield

  const passwordTextField = document.querySelectorAll(".textField");
  for (var i = 0; i < passwordTextField.length; i++) {
    passwordTextField[i].onfocus = function () {
      this.classList.remove("error");
    };
  }
})();
