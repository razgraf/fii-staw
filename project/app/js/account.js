/**
 * Created by @VanSoftware on 20/03/2019.
 */

import {
  Structure,
  Slider,
  ClassHelper,
  Alert,
  ButtonHelper,
  VanLoading
} from "./../base/util.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
  Structure.initNavigation();
  VanLoading.showBlock(() => {}, 1);

  initProfile();
}

function initProfile() {
  let greeting = document.querySelector("section#account #greeting > span");
  if (!ClassHelper.isEmpty(greeting)) {
    greeting.innerText = "@johnconstantine";
  }

  let field_firstName = document.querySelector(
    "section#account #account-firstName"
  );
  let field_lastName = document.querySelector(
    "section#account #account-lastName"
  );

  if (
    !ClassHelper.isEmpty(field_firstName) &&
    !ClassHelper.isEmpty(field_lastName)
  ) {
    if (!ClassHelper.isEmpty(API) && !ClassHelper.isEmpty(API["USER"])) {
      if (!ClassHelper.isEmpty(API["USER"]["firstName"]))
        field_firstName.value = API["USER"]["firstName"];

      if (!ClassHelper.isEmpty(API["USER"]["lastName"]))
        field_lastName.value = API["USER"]["lastName"];
    }
  }

  let accountLogOutButton = document.querySelector("#button-logOut");
  if (accountLogOutButton)
    accountLogOutButton.onclick = () => {
      doLogOut();
    };
}

function doLogOut() {
  let accountLogOutButton = document.querySelector("#button-logOut");
  ButtonHelper.disable(accountLogOutButton, true);

  return;
}
