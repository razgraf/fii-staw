"use strict";

import { STORE_KEYS } from "./config.js";

class ClassHelper {
  constructor() {}

  /**
   *
   * @param {Object} object
   * @param {String|int}key
   * @param {Boolean} shouldNullify
   * @returns {*|String|int}
   */
  static getValue(object, key, shouldNullify = false) {
    if (ClassHelper.isDataSetInObject(key, object)) {
      let value = object[key];
      if (shouldNullify) object[key] = null;
      return value;
    }
    return null;
  }

  /**
   *
   * @param {Object} object
   * @param {String|int}key
   * @param {Boolean} shouldNullify
   * @returns {*|Object}
   */

  static getObject(object, key, shouldNullify = false) {
    if (ClassHelper.isObjectSetInObject(key, object)) {
      let value = object[key];
      if (shouldNullify) object[key] = null;
      return value;
    }
    return null;
  }

  /**
   *
   * @param {Object} object
   * @param {String|int}key
   * @returns {*|Array}
   */
  static getArray(object, key) {
    if (this.isArraySetInObject(key, object)) {
      return object[key];
    }
    return [];
  }

  /**
   *
   * @param array
   * @param {Function} creator - will be a function that will create an object from the variables (e.g. return new Person(someNotParsedObject))
   * @returns {Array}
   */

  static parseArrayElementWithClass(
    array,
    creator = function(element, position) {
      return element;
    }
  ) {
    if (array === null || array.length === 0) return [];
    let result = [];
    for (let i = 0; i < array.length; i++) {
      result.push(creator(array[i], i));
    }
    return result;
  }

  static isEmpty(value) {
    try {
      if (value === undefined) return true;
      if (typeof value === "undefined" || value === null) return true; //first check if value is defined and !null

      //case : object
      if (typeof value === "object") {
        for (let key in value) if (key !== undefined) return false; //check if the object has any values
      }
      //case : array
      else if (value.constructor === Array) {
        if (value.length !== 0) return false; //check if the array has positive length
      }
      //case : string/number
      else {
        if (value === "0" || value === 0 || value === false || value === true)
          return false;
        return !value || /^\s*$/.test(String(value));
      }
    } catch (err) {
      console.error(err);
    }

    return true;
  }
  static isDataSetInObject(key, object) {
    if (object === null || object === undefined || object.length === 0)
      return false;
    if (!object.hasOwnProperty(key)) return false;
    return !ClassHelper.isEmpty(object[key]);
  }
  static isObjectSetInObject(key, object) {
    if (object === null || object === undefined || object.length === 0)
      return false;
    if (!object.hasOwnProperty(key)) return false;
    return object[key] !== null;
  }
  static isArraySetInObject(key, object) {
    if (object === null || object === undefined || object.length === 0)
      return false;
    if (!object.hasOwnProperty(key)) return false;
    return object[key] !== null && object[key].length > 0;
  }

  static sanitize(value, fallback = "") {
    return ClassHelper.isEmpty(value) ? fallback : value;
  }

  static imageExists(url, callback) {
    var img = new Image();
    img.onload = function() {
      callback(true);
    };
    img.onerror = function() {
      callback(false);
    };
    img.src = url;
  }

  static prettifyURL(string) {
    const a = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;";
    const b = "aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------";
    const p = new RegExp(a.split("").join("|"), "g");
    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, "-and-") // Replace & with ‘and’
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }
}
class VanLoading {
  /**
   *
   * @param {Function} callback
   * @param {null | int} timeout - If null, the callback won't be called. If bigger than 30s, the block won't be hidden automatically.
   */
  static showBlock(callback = () => {}, timeout = null) {
    if (window.BLOCK_TIMEOUT === undefined) window.BLOCK_TIMEOUT = null;

    let block = document.querySelector(".loading-block");

    if (block === null) {
      document
        .querySelector("body")
        .insertAdjacentHTML(
          "afterbegin",
          `<div class="loading-block active"><div class="content"><div class="icon"><i class="material-icons-round">account_tree</i></div></div></div>`
        );
      block = document.querySelector(".loading-block");
    } else {
      let blockContent = document.querySelector(".loading-block > .content");
      if (!blockContent) {
        block.insertAdjacentHTML(
          "afterbegin",
          `<div class="content"><div class="icon"><i class="material-icons-round">account_tree</i></div></div>`
        );
      }
    }

    block.classList.add("active");

    if (window.BLOCK_TIMEOUT !== null) {
      clearTimeout(window.BLOCK_TIMEOUT);
      window.BLOCK_TIMEOUT = null;
    }

    if (timeout !== null) {
      if (timeout > 30000) return;
      window.BLOCK_TIMEOUT = setTimeout(() => {
        VanLoading.hideBlock();
        if (typeof callback === "function") callback();
      }, timeout);
    }
  }

  static hideBlock(callback = () => {}, timeout = null) {
    if (window.BLOCK_TIMEOUT === undefined) window.BLOCK_TIMEOUT = null;
    let block = document.querySelector(".loading-block");
    if (block === null) return;

    let hideIt = () => {
      block.classList.remove("active");
      if (window.BLOCK_TIMEOUT !== null) {
        clearTimeout(window.BLOCK_TIMEOUT);
        window.BLOCK_TIMEOUT = null;
      }
      if (typeof callback === "function") callback();
    };

    if (timeout !== null) {
      setTimeout(hideIt, timeout);
    } else hideIt();
  }
}
class Slider {
  static doMove(button, slider, direction = "right") {
    if (window.scrollAmount === undefined) window.scrollAmount = 0;

    document.querySelector(button).addEventListener("click", function(event) {
      Slider.sideScroll(document.querySelector(slider), direction, 385, 15);
    });
  }
  static sideScroll(element, direction, distance, step) {
    window.scrollAmount = 0;
    let slideTimer = setInterval(function() {
      if (direction === "left") {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      window.scrollAmount += step;
      if (window.scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, 10);
  }
}
class Structure {
  static initNavigation() {
    document
      .querySelector("nav .nav-logo")
      .addEventListener("click", function(event) {
        if (window.innerWidth <= 992) {
          event.preventDefault();
          if (
            document.querySelector("body").classList.contains("menu-active")
          ) {
            document.querySelector("body").classList.remove("menu-active");
          } else document.querySelector("body").classList.add("menu-active");
        }
      });

    let name = document.querySelector(
      "nav li.nav-menu-item > a.container[href='account.html'] span"
    );

    console.log(name, Store.get(STORE_KEYS.USERNAME));

    if (name && !Store.isEmpty(STORE_KEYS.USERNAME))
      name.innerText = `@${Store.get(STORE_KEYS.USERNAME)}'s Keys`;
  }
}

window.ALERT_TYPE_SUCCESS = 1;
window.ALERT_TYPE_FAILURE = 2;
window.ALERT_INDEX = 0;

class Alert {
  static init() {
    let print = '<div id="customAlertContainer"></div>';
    document.querySelector("body").insertAdjacentHTML("afterbegin", print);
  }

  static showAlert(
    text,
    type = window.ALERT_TYPE_FAILURE,
    timeout = 3000,
    callback = () => {}
  ) {
    window.ALERT_INDEX++;

    if (!document.querySelector("#customAlertContainer")) Alert.init();
    let parent = document.querySelector("#customAlertContainer");

    let print_success =
      '<div data-index = "' +
      window.ALERT_INDEX +
      '" class="customAlert success" role="alert"  ><span></span></div> ';
    let print_failure =
      '<div data-index = "' +
      window.ALERT_INDEX +
      '" class="customAlert failure" role="alert" ><div class="warnContainer"><i class="material-icons">warning</i></div><span></span></div> ';

    /**
     *
     * @type {Element}
     */
    let element = null;

    if (type === window.ALERT_TYPE_SUCCESS) {
      parent.insertAdjacentHTML("beforeend", print_success);
      element = parent.querySelector(
        ".customAlert.success[data-index='" + window.ALERT_INDEX + "']"
      );
    } else if (type === window.ALERT_TYPE_FAILURE) {
      parent.insertAdjacentHTML("beforeend", print_failure);
      element = parent.querySelector(
        ".customAlert.failure[data-index='" + window.ALERT_INDEX + "']"
      );
    }

    if (!element) return;
    element.querySelector("span").innerText = text;

    setTimeout(() => {
      element.classList.add("show");
    }, 100);

    setTimeout(function() {
      element.classList.remove("show");
      setTimeout(() => {
        element.remove();
        if (callback !== null && typeof callback === "function") callback();
      }, 350);
    }, timeout);
  }
}

class ButtonHelper {
  /**
   *
   * @param {Element} element
   * @param {Boolean} loader
   */
  static disable(element, loader = false) {
    if (!element) {
      console.error("Element missing on disable.", element);
      return;
    }
    if (!element.classList.contains("disableClick"))
      element.classList.add("disableClick");
    if (loader) {
      if (!element.querySelector(".loader")) {
        element.insertAdjacentHTML(
          "beforeend",
          "<div class='loader' style='position:relative; right:0;'><span style='padding-left: 5px'> ...</span></div>"
        );
      }
    } else {
      if (element.querySelector(".loader")) {
        element.querySelector(".loader").remove();
      }
    }
  }

  /**
   *
   * @param {Element} element
   * @param {Boolean} loader
   */
  static enable(element, loader = false) {
    if (!element) {
      console.error("Element missing on disable.", element);
      return;
    }
    if (element.classList.contains("disableClick"))
      element.classList.remove("disableClick");
    if (loader) {
      if (!element.querySelector(".loader")) {
        element.insertAdjacentHTML(
          "beforeend",
          "<div class='loader'><i class='material-icons'>autorenew</i></div>"
        );
      }
      element.querySelector(".loader").remove();
    } else {
      if (!element.querySelector(".loader")) {
        element.querySelector(".loader").remove();
      }
    }
  }
}

class Store {
  static get(key) {
    return window.localStorage.getItem(key);
  }

  static set(key, value) {
    window.localStorage.setItem(key, value);
  }

  static isEmpty(key) {
    return ClassHelper.isEmpty(window.localStorage.getItem(key));
  }

  static remove(key) {
    window.localStorage.removeItem(key);
  }

  static clean() {
    window.localStorage.clear();
  }

  static panic(location = "/") {
    Store.clean();
    Alert.showAlert(
      "Your session expired. Please connect again to the platform.",
      window.ALERT_TYPE_FAILURE,
      2000,
      () => {
        if (location) window.location.href = location;
      }
    );
  }
}

export {
  Alert,
  ClassHelper,
  Slider,
  ButtonHelper,
  VanLoading,
  Structure,
  Store
};
