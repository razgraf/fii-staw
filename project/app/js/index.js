import {
  Alert,
  Structure,
  Slider,
  Store,
  ClassHelper,
  VanLoading
} from "./../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../base/config.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
  VanLoading.showBlock(() => {}, 3000);
  Structure.initNavigation();

  if (Store.isEmpty(STORE_KEYS.TOKEN)) window.location.href = "./connect.html";
  else VanLoading.hideBlock();
}
