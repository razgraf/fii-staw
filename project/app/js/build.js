import {
  Structure,
  ClassHelper,
  Alert,
  ButtonHelper,
  Store,
  VanLoading
} from "../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../base/config.js";
import Fractal from "./model/Fractal.js";

let FLAG_IS_PUBLISHING = false;
let FLAG_IS_GENERATING = false;

document.addEventListener("DOMContentLoaded", init);

function init() {
  Structure.initNavigation();
  VanLoading.showBlock(() => {}, 20000);

  if (Store.isEmpty(STORE_KEYS.TOKEN)) window.location.href = "./connect.html";
  else initBuilder();
}

function initBuilder() {
  VanLoading.hideBlock();
}
