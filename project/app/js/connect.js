import { Structure, ClassHelper, Alert, ButtonHelper } from "../base/util.js";

/**
 * Created by @VanSoftware on 2019-06-10.
 */

document.addEventListener("DOMContentLoaded", init);

function init() {
  Structure.initNavigation();

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("register") === true) {
    document.querySelector(".card.register").style.display = "flex";
    document.querySelector(".title.register").style.display = "flex";
  } else {
    document.querySelector(".card.login").style.display = "flex";
    document.querySelector(".title.login").style.display = "flex";
  }

  let buttonLogIn = document.querySelector("#button_login");
  if (!ClassHelper.isEmpty(buttonLogIn)) {
    buttonLogIn.onclick = () => {
      doLogin();
    };
  } else {
    let buttonRegister = document.querySelector("#button_register");
    if (!ClassHelper.isEmpty(buttonRegister)) {
      buttonRegister.onclick = () => {
        doRegister();
      };
    }
  }
}

function doLogin() {
  let card = document.querySelector("div.card.login .main");
  let buttonLogIn = document.querySelector("#button_login");

  let field_email = card.querySelector("#login-email");
  let field_password = card.querySelector("#login-password");

  if (ClassHelper.isEmpty(field_email) || ClassHelper.isEmpty(field_password)) {
    Alert.showAlert("Missing fields.");
    return;
  }

  let email = field_email.value;
  if (ClassHelper.isEmpty(email) || email.length < 3) {
    Alert.showAlert("Please add a valid email first.");
    return;
  }
  let password = field_password.value;
  if (ClassHelper.isEmpty(password) || email.length < 3) {
    Alert.showAlert("Please add a valid password first.");
    return;
  }

  ButtonHelper.disable(buttonLogIn, true);

  let data = new FormData();
  data.append("email", email);
  data.append("password", password);

  return;

  fetch(API["URL_USER_CONNECT"], {
    method: "POST",
    body: data
    // credentials: 'include'
  })
    .then(response => {
      if (response.ok) return response.json();
      throw response;
    })
    .then(response => {
      Alert.showAlert(
        "Welcome to RealHome",
        window.ALERT_TYPE_SUCCESS,
        1500,
        () => {
          window.location.href = "./";
        }
      );
    })
    .catch(response => {
      response.json().then(response => {
        console.error(response);
        if (
          !ClassHelper.isEmpty(response) &&
          !ClassHelper.isEmpty(response["message"])
        )
          Alert.showAlert(response["message"]);
        else
          Alert.showAlert(
            "Oops. Something doesn't seem right. Please try again."
          );
      });
    })
    .finally(() => {
      ButtonHelper.enable(buttonLogIn, true);
    });
}

function doRegister() {
  let card = document.querySelector("div.card.register .main");
  let buttonRegister = document.querySelector("#button_register");

  let field_firstName = card.querySelector("#register-firstName");
  let field_lastName = card.querySelector("#register-lastName");
  let field_email = card.querySelector("#register-email");
  let field_password = card.querySelector("#register-password");

  if (
    ClassHelper.isEmpty(field_email) ||
    ClassHelper.isEmpty(field_password) ||
    ClassHelper.isEmpty(field_firstName) ||
    ClassHelper.isEmpty(field_lastName)
  ) {
    Alert.showAlert("Missing fields.");
    return;
  }

  let firstName = field_firstName.value;
  if (ClassHelper.isEmpty(firstName) || firstName.length < 2) {
    Alert.showAlert("Please add a valid First Name first.");
    return;
  }
  let lastName = field_lastName.value;
  if (ClassHelper.isEmpty(lastName) || lastName.length < 2) {
    Alert.showAlert("Please add a valid Last Name first.");
    return;
  }

  let email = field_email.value;
  if (ClassHelper.isEmpty(email) || email.length < 3) {
    Alert.showAlert("Please add a valid email first.");
    return;
  }
  let password = field_password.value;
  if (ClassHelper.isEmpty(password) || email.length < 3) {
    Alert.showAlert("Please add a valid password first.");
    return;
  }

  ButtonHelper.disable(buttonRegister, true);

  let data = new FormData();
  data.append("email", email);
  data.append("password", password);
  data.append("firstName", firstName);
  data.append("lastName", lastName);

  return;

  fetch(API["URL_USER_REGISTER"], {
    method: "POST",
    body: data
    // credentials: 'include'
  })
    .then(response => {
      if (response.ok) return response.json();
      throw response;
    })
    .then(response => {
      Alert.showAlert(
        "Welcome to RealHome",
        window.ALERT_TYPE_SUCCESS,
        1500,
        () => {
          window.location.href = "./";
        }
      );
    })
    .catch(response => {
      response.json().then(response => {
        console.error(response);
        if (
          !ClassHelper.isEmpty(response) &&
          !ClassHelper.isEmpty(response["message"])
        )
          Alert.showAlert(response["message"]);
        else
          Alert.showAlert(
            "Oops. Something doesn't seem right. Please try again."
          );
      });
    })
    .finally(() => {
      ButtonHelper.enable(buttonRegister, true);
    });
}
