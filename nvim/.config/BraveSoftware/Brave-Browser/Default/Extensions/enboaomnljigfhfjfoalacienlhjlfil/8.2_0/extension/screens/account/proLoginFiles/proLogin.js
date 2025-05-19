(function () {
  function showLogInError(text) {
    queryById("logInError").innerHTML = text;
    queryById("logInError").style.display = "block";
  }

  document
    .querySelector(".logInForm")
    .addEventListener("submit", function (event) {
      // Prevent the default form submission behavior

      event.preventDefault();

      const email = queryById("proLoginEmail").value;
      const password = queryById("proLoginPassword").value;

      serverLogIn(email, password)
        .then((result) => {
          // Handle result
          if (result == "Login") {
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
            queryById("proLoginEmail").value = "";
            queryById("proLoginPassword").value = "";
            queryById("logInError").style.display = "none";

            // Set fields
            setEmailPasswordFromStorage();

            // Try to sync
            tryToSyncFromServer();
          } else {
            showLogInError(result);
          }
        })
        .catch((error) => {
          // Handle errors here
          showLogInError("Error: " + error);
        });
    });
})();
