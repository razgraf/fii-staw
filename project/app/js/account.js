import {
  Structure,
  ClassHelper,
  Alert,
  ButtonHelper,
  Store,
  VanLoading
} from "./../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../base/config.js";
import Key from "./model/Key.js";

let FLAG_IS_GENERATING_KEY = false;

document.addEventListener("DOMContentLoaded", init);

function init() {
  Structure.initNavigation();
  VanLoading.showBlock(() => {}, 1000000);

  if (Store.isEmpty(STORE_KEYS.TOKEN)) window.location.href = "./connect.html";
  else initProfile();
}

function initProfile() {
  retrieveKeys();

  const greeting = document.querySelector("section#account #greeting > span");
  if (!ClassHelper.isEmpty(greeting)) {
    greeting.innerText = `@${Store.get(STORE_KEYS.USERNAME)}`;
  }

  const accountLogOutButton = document.querySelector("#button-logOut");
  if (accountLogOutButton)
    accountLogOutButton.onclick = () => {
      doLogOut();
    };

  const generateKeyButton = document.querySelector("#generateKeyButton");
  if (generateKeyButton)
    generateKeyButton.onclick = () => {
      doGenerateKey();
    };
}

async function doGenerateKey() {
  if (FLAG_IS_GENERATING_KEY) return;

  FLAG_IS_GENERATING_KEY = true;

  const parent = document.querySelector("#key-list");
  const generateKeyButton = document.querySelector("#generateKeyButton");

  ButtonHelper.disable(generateKeyButton, true);

  const response = await Key.assign();
  console.log(response);

  try {
    if ([HTTP_STATUS.CREATED].includes(response.status)) {
      const result = await response.json();
      console.log("Result:", result);

      if (!ClassHelper.isEmpty(result.key)) {
        const key = result.key;
        new Key(key).printElement(parent, true);
      }
    } else if ([HTTP_STATUS.FORBIDDEN].includes(response.status)) {
      Store.panic();
    } else {
      throw new Error("Hmm...");
    }
  } catch (err) {
    console.error(err);
    Alert.showAlert(
      "Oops. Something doesn't seem right. Please try reload the page."
    );
  }

  ButtonHelper.enable(generateKeyButton, true);
  FLAG_IS_GENERATING_KEY = false;
}

async function retrieveKeys() {
  const parent = document.querySelector("#key-list");

  const response = await Key.getList();

  console.log("response", response);

  if ([HTTP_STATUS.OK].includes(response.status)) {
    VanLoading.hideBlock();

    const result = await response.json();
    console.log("Result:", result);

    if (!ClassHelper.isEmpty(result.keys) && result.keys.length > 0) {
      const keys = result.keys;
      if (document.querySelector("#noDataFound"))
        document.querySelector("#noDataFound").remove();
      keys.map(e => new Key(e)).forEach(e => e.printElement(parent));
    } else
      parent.innerHTML =
        "<p id='noDataFound'> You have no API Keys at the moment </p>";
  } else if ([HTTP_STATUS.FORBIDDEN].includes(response.status)) {
    Store.panic();
  } else {
    Alert.showAlert(
      "Oops. Something doesn't seem right. Please try reload the page."
    );
  }
}

function doLogOut() {
  let accountLogOutButton = document.querySelector("#button-logOut");
  ButtonHelper.disable(accountLogOutButton, true);
  Store.clean();
  Alert.showAlert(
    "You have been logged out. Sorry to see you go :(",
    window.ALERT_TYPE_SUCCESS,
    2000,
    () => {
      window.location.href = "./connect.html";
    }
  );

  return;
}
