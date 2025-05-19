// MARK: - Update Settings

function serverUpdateSettings(
  user,
  password,
  featuresSettings,
  desktopSettings,
  mobileSettings,
  lastModified
) {
  // URL to PHP script

  const phpScriptURL = "https://untrap.app/db/updateFields.php";

  // Data to be sent to the PHP script

  const data = new URLSearchParams();

  data.append("user", user);
  data.append("password", password);

  data.append("untrap_FeaturesSettings", featuresSettings);
  data.append("untrap_DesktopSettings", desktopSettings);
  data.append("untrap_MobileSettings", mobileSettings);
  data.append("untrap_LastSettingsModified", lastModified);

  // Perform a POST request to the PHP script

  return new Promise((resolve, reject) => {
    fetch(phpScriptURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.text())
      .then((result) => {
        // Handle the result returned by the PHP script
        resolve(result);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}

// MARK: - Fetch Settings

function serverFetchSettings(user, password, fields) {
  // URL to PHP script

  const phpScriptURL = "https://untrap.app/db/fetchFields.php";

  // Data to be sent to the PHP script

  const data = new URLSearchParams();

  data.append("user", user);
  data.append("password", password);
  data.append("fields", JSON.stringify(fields));

  // Perform a POST request to the PHP script

  return new Promise((resolve, reject) => {
    fetch(phpScriptURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // Handle the result returned by the PHP script
        resolve(result);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}

// MARK: - Update Login

function serverUpdateLogin(newEmail, oldEmail, password) {
  // URL to PHP script

  const phpScriptURL = "https://untrap.app/db/updateLogin.php";

  // Data to be sent to the PHP script

  const data = new URLSearchParams();
  data.append("newUsername", newEmail);

  data.append("currentUsername", oldEmail);
  data.append("password", password);

  // Perform a POST request to the PHP script

  return new Promise((resolve, reject) => {
    fetch(phpScriptURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.text())
      .then((result) => {
        // Handle the result returned by the PHP script
        resolve(result);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}

// MARK: - Update Password

function serverUpdatePassword(newPassword, email, password) {
  // URL to PHP script

  const phpScriptURL = "https://untrap.app/db/updatePass.php";

  // Data to be sent to the PHP script

  const data = new URLSearchParams();
  data.append("user", email);
  data.append("oldPassword", password);

  data.append("newPassword", newPassword);

  // Perform a POST request to the PHP script

  return new Promise((resolve, reject) => {
    fetch(phpScriptURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.text())
      .then((result) => {
        // Handle the result returned by the PHP script
        resolve(result);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}

// MARK: - Log In

function serverLogIn(user, password) {
  // URL to PHP script

  const phpScriptURL = "https://untrap.app/db/login.php";

  // Data to be sent to the PHP script

  const data = new URLSearchParams();
  data.append("user", user);
  data.append("password", password);

  // Perform a POST request to the PHP script

  return new Promise((resolve, reject) => {
    fetch(phpScriptURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.text())
      .then((result) => {
        // Handle the result returned by the PHP script
        resolve(result);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}

// MARK: - Sign Up

function serverSignUp(user, password) {
  // URL to PHP script

  const phpScriptURL = "https://untrap.app/db/signup.php";

  // Data to be sent to the PHP script

  const data = new URLSearchParams();
  data.append("user", user);
  data.append("password", password);

  // Perform a POST request to the PHP script

  return new Promise((resolve, reject) => {
    fetch(phpScriptURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.text())
      .then((result) => {
        // Handle the result returned by the PHP script
        resolve(result);
      })
      .catch((error) => {
        // Handle errors
        reject(error);
      });
  });
}
