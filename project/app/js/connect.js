import {
  Alert,
  ButtonHelper,
  ClassHelper,
  Store,
  Structure
} from "../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../base/config.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
  Structure.initNavigation();

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("register") === true) {
    document.querySelector(".card.register").style.display = "flex";
    document.querySelector(".title.register").style.display = "flex";

    let buttonRegister = document.querySelector("#button_register");
    if (!ClassHelper.isEmpty(buttonRegister)) {
      buttonRegister.onclick = () => {
        doRegister();
      };
    }
  } else {
    document.querySelector(".card.login").style.display = "flex";
    document.querySelector(".title.login").style.display = "flex";

    let buttonLogIn = document.querySelector("#button_login");
    if (!ClassHelper.isEmpty(buttonLogIn)) {
      buttonLogIn.onclick = () => {
        doLogin();
      };
    }
  }
}

async function doLogin() {
  let card = document.querySelector("div.card.login .main");
  let buttonLogIn = document.querySelector("#button_login");

  let field_email = card.querySelector("#login-email");
  let field_password = card.querySelector("#login-password");

  let email = field_email.value;
  if (ClassHelper.isEmpty(email) || email.length < 4 || !email.includes("@")) {
    Alert.showAlert("Please add a valid email first.");
    return;
  }
  let password = field_password.value;
  if (ClassHelper.isEmpty(password) || email.length < 6) {
    Alert.showAlert("Please add a valid password first (> 6 chars).");
    return;
  }

  ButtonHelper.disable(buttonLogIn, true);

  const response = await fetch(API.LOGIN, {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  if ([HTTP_STATUS.OK].includes(response.status)) {
    const result = await response.json();
    console.log("Result:", result);

    Store.clean();

    if (!ClassHelper.isEmpty(result["token"])) {
      Store.set(STORE_KEYS.TOKEN, result["token"]);
      if (!ClassHelper.isEmpty(result["username"]))
        Store.set(STORE_KEYS.USERNAME, result["username"]);

      Alert.showAlert(
        "Welcome back to FrIC Builder!",
        window.ALERT_TYPE_SUCCESS,
        1500,
        () => {
          window.location.href = "./index.html";
        }
      );
    } else showAlert("System error. Please contact the fractal GOD.");
  } else {
    try {
      const error = await response.json();
      console.error("Error", error);

      if (
        !ClassHelper.isEmpty(error) &&
        !ClassHelper.isEmpty(error["message"])
      ) {
        switch (error["message"]) {
          case ERRORS.MISMATCH_USER_AUTH: {
            Alert.showAlert(
              "Please enter your password again. Credentials don't match."
            );
            break;
          }
          default:
            Alert.showAlert(error["message"]);
        }
      } else throw new Error();
    } catch (e) {
      console.error(e);
      Alert.showAlert("Oops. Something doesn't seem right. Please try again.");
    }
  }

  ButtonHelper.enable(buttonLogIn, true);
}

async function doRegister() {
  let card = document.querySelector("div.card.register .main");
  let buttonRegister = document.querySelector("#button_register");

  let field_username = card.querySelector("#register-username");
  let field_email = card.querySelector("#register-email");
  let field_password = card.querySelector("#register-password");

  let username = field_username.value;
  if (ClassHelper.isEmpty(username) || username.length < 3) {
    Alert.showAlert("Please add a valid Username first (> 3 chars).");
    return;
  }

  let email = field_email.value;
  if (ClassHelper.isEmpty(email) || email.length < 4 || !email.includes("@")) {
    Alert.showAlert("Please add a valid email first.");
    return;
  }
  let password = field_password.value;
  if (ClassHelper.isEmpty(password) || email.length < 6) {
    Alert.showAlert("Please add a valid password first (> 6 chars).");
    return;
  }

  ButtonHelper.disable(buttonRegister, true);

  const response = await fetch(API.REGISTER, {
    method: "POST",
    body: JSON.stringify({
      email: email,
      username: username,
      password: password
    })
  });

  if ([HTTP_STATUS.CREATED].includes(response.status)) {
    const result = await response.json();
    console.log("Result:", result);

    Store.clean();

    if (!ClassHelper.isEmpty(result["token"])) {
      Store.set(STORE_KEYS.TOKEN, result["token"]);
      if (!ClassHelper.isEmpty(result["username"]))
        Store.set(STORE_KEYS.USERNAME, result["username"]);

      Alert.showAlert(
        "Welcome to FrIC Builder!",
        window.ALERT_TYPE_SUCCESS,
        1500,
        () => {
          window.location.href = "./index.html";
        }
      );
    } else showAlert("System error. Please contact the fractal GOD.");
  } else {
    try {
      const error = await response.json();
      console.error("Error", error);

      if (
        !ClassHelper.isEmpty(error) &&
        !ClassHelper.isEmpty(error["message"])
      ) {
        switch (error["message"]) {
          case ERRORS.CONFLICTING_USER: {
            Alert.showAlert(
              "User already registered. Please pick another unique email or username to create a new identity."
            );
            break;
          }
          default:
            Alert.showAlert(error["message"]);
        }
      } else throw new Error();
    } catch (e) {
      console.error(e);
      Alert.showAlert("Oops. Something doesn't seem right. Please try again.");
    }
  }

  ButtonHelper.enable(buttonRegister, true);
}
