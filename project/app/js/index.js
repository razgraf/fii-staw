import {
  Alert,
  Structure,
  Slider,
  Store,
  ClassHelper,
  VanLoading
} from "./../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../base/config.js";
import Fractal from "./model/Fractal.js";

document.addEventListener("DOMContentLoaded", init);

let LIMIT = 50;
let OFFSET = 0;

let FLAG_LIST_REQUESTED = false;

function init() {
  Structure.initNavigation();
  VanLoading.showBlock(() => {}, 1000000);

  if (Store.isEmpty(STORE_KEYS.TOKEN)) window.location.href = "./connect.html";
  else retrieveFractals();
}

async function retrieveFractals() {
  if (FLAG_LIST_REQUESTED) return;

  const parent = document.querySelector("#fractal-grid");

  FLAG_LIST_REQUESTED = true;

  try {
    const response = await Fractal.getList(LIMIT, OFFSET);

    console.log("response", response);

    if ([HTTP_STATUS.OK].includes(response.status)) {
      VanLoading.hideBlock();

      const result = await response.json();
      console.log("Result:", result);

      if (!ClassHelper.isEmpty(result.list) && result.list.length > 0) {
        const fractals = result.list;
        fractals.map(e => new Fractal(e)).forEach(e => e.printElement(parent));
      } else parent.innerHTML = "<p> There are no fractals at the moment </p>";
    } else if ([HTTP_STATUS.FORBIDDEN].includes(response.status)) {
      // Store.panic();
    } else {
      Alert.showAlert(
        "Oops. Something doesn't seem right. Please try reload the page."
      );
    }
  } catch (e) {
    console.error(e);
  }

  FLAG_LIST_REQUESTED = false;
}
