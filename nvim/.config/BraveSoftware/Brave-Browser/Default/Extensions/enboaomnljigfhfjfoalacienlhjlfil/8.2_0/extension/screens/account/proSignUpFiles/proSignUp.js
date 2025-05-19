(function () {
  function showSignUpError(text) {
    queryById("signUpError").innerHTML = text;
    queryById("signUpError").style.display = "block";
  }

  document
    .querySelector(".signUpForm")
    .addEventListener("submit", function (event) {
      // Prevent the default form submission behavior

      event.preventDefault();

      const email = queryById("proSignUpEmail").value;
      const password = queryById("proSignUpPassword").value;

      serverSignUp(email, password)
        .then((result) => {
          // Handle result
          if (result == "Created") {
            // Set to storage
            setToStorage(
              getConstNotSyncing.pro_usernameData,
              email,
              function () {}
            );
            setToStorage(
              getConstNotSyncing.pro_passwordData,
              password,
              function () {}
            );

            // Update isLogin state
            document.documentElement.setAttribute("isLogin", "true");
            app_isLogin = "true";

            // Set to Log Out Info
            queryById("userLoginEmail").innerHTML = email;

            // Back to More Screen
            showScreen("moreScreen");

            // Clean
            queryById("proSignUpEmail").value = "";
            queryById("proSignUpPassword").value = "";
            queryById("signUpError").style.display = "none";

            // Set fields
            setEmailPasswordFromStorage();

            // Try to sync
            tryToSyncFromServer();
          } else {
            showSignUpError(result);
          }
        })
        .catch((error) => {
          // Handle errors here
          showSignUpError("Error: " + error);
        });
    });
})();
