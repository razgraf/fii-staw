import {
  Structure,
  ClassHelper,
  Alert,
  ButtonHelper,
  Store,
  VanLoading
} from "../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../base/config.js";
import User from "./model/User.js";
import Fractal from "./model/Fractal.js";

import FractalBuilder from "../node_modules/fractal-builder/index.mjs";

let FLAG_IS_PUBLISHING = false;
let FLAG_IS_GENERATING = false;
let FLAG_IS_KEYING = false;

let CURRENT_FRACTAL_UUID = null;

const MAX_RULES = 4;
const FIELDS = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  Structure.initNavigation();
  VanLoading.showBlock(() => {}, 20000);

  if (Store.isEmpty(STORE_KEYS.TOKEN)) window.location.href = "./connect.html";
  else initBuilder();
}

async function initBuilder() {
  initPanel();

  const container = document.querySelector(".playground #showcase");
  const loader = container.querySelector(".loader");
  const empty = container.querySelector(".empty");

  empty.dataset.visible = true;
  loader.dataset.visible = false;

  document.querySelector("#buttonGenerate").onclick = () => {
    doGenerate();
  };

  document.querySelector("#buttonPublish").onclick = () => {
    doPublish();
  };

  ButtonHelper.disable(document.querySelector("#buttonPublish"), false);

  await retrieveUser();
}
async function retrieveUser() {
  FLAG_IS_KEYING = true;
  const response = await User.getCredentials();

  console.log("response", response);

  if ([HTTP_STATUS.OK].includes(response.status)) {
    FLAG_IS_KEYING = false;
    const result = await response.json();
    console.log("Result:", result);

    window.FractalBuilderService = new FractalBuilder(result.user);
    VanLoading.hideBlock();
  } else if ([HTTP_STATUS.FORBIDDEN].includes(response.status)) {
    Store.panic();
  } else {
    Alert.showAlert(
      "Oops. Something doesn't seem right. Please try reload the page."
    );
  }
}

async function doGenerate() {
  document.querySelector("#showcaseHere").src = "";
  CURRENT_FRACTAL_UUID = null;

  const container = document.querySelector(".playground #showcase");
  const loader = container.querySelector(".loader");
  const empty = container.querySelector(".empty");

  if (FLAG_IS_GENERATING) return;
  const button = document.querySelector("#buttonGenerate");
  FLAG_IS_GENERATING = true;

  ButtonHelper.disable(button, true);
  ButtonHelper.disable(document.querySelector("#buttonPublish"));

  empty.dataset.visible = false;
  loader.dataset.visible = true;

  try {
    const payload = {};
    console.log(FIELDS);

    payload.height = Number(FIELDS.height.value);
    payload.width = Number(FIELDS.width.value);
    payload.angle = Number(FIELDS.angle.value);
    payload.iterations = Number(FIELDS.iterations.value);
    payload.start = {
      symbol: FIELDS.startSymbol.value,
      x: Number(FIELDS.startSymbolX.value),
      y: Number(FIELDS.startSymbolY.value)
    };
    payload.rules = Object.keys(FIELDS.rules)
      .map(key => FIELDS.rules[key])
      .map(rule => [rule[0].value, rule[1].value])
      .filter(
        rule => !ClassHelper.isEmpty(rule[0]) && !ClassHelper.isEmpty(rule[1])
      )
      .map(rule => ({ left: rule[0], right: rule[1] }));

    console.log(payload);
    const generatedFractal = await window.FractalBuilderService.build(payload);
    console.log(generatedFractal);

    if (generatedFractal && generatedFractal.url && generatedFractal.uuid) {
      loader.dataset.visible = false;
      document.querySelector("#showcaseHere").src = generatedFractal.url;
      CURRENT_FRACTAL_UUID = generatedFractal.uuid;
      console.log(document.querySelector("#buttonPublish"));

      ButtonHelper.enable(document.querySelector("#buttonPublish"), true);

      Alert.showAlert("Generated successfully!", window.ALERT_TYPE_SUCCESS);
    } else {
      document.querySelector("#showcaseHere").src = "";
      empty.dataset.visible = true;
      Alert.showAlert("Couldn't generate fractal with given rules.");
    }
  } catch (e) {
    console.error(e);
    document.querySelector("#showcaseHere").src = "";
    loader.dataset.visible = false;
    empty.dataset.visible = true;
  } finally {
    FLAG_IS_GENERATING = false;
    ButtonHelper.enable(button, true);
  }
}
async function doPublish() {
  if (CURRENT_FRACTAL_UUID === null) {
    Alert.showAlert("Fractal not generated yet.");
    return;
  }

  if (FLAG_IS_PUBLISHING) return;
  FLAG_IS_PUBLISHING = true;

  ButtonHelper.disable(document.querySelector("#buttonPublish"), true);

  try {
    const response = await Fractal.publish({ uuid: CURRENT_FRACTAL_UUID });

    console.log(response);

    if ([HTTP_STATUS.OK].includes(response.status)) {
      const result = await response.json();
      console.log("Result:", result);

      Alert.showAlert(
        "Published to FrIC!",
        window.ALERT_TYPE_SUCCESS,
        2000,
        () => {
          window.location.href = "./index.html";
        }
      );
    } else if ([HTTP_STATUS.FORBIDDEN].includes(response.status)) {
      Store.panic();
    } else {
      throw new Error("Hmm...");
    }
  } catch (e) {
    Alert.showAlert("Couldn't publish this fractal.");
    console.error(e);
  } finally {
    FLAG_IS_PUBLISHING = false;
    ButtonHelper.enable(document.querySelector("#buttonPublish"), true);
  }
}

function initPanel() {
  const parentRules = document.querySelector(".section.rules > .card");
  const parentConfig = document.querySelector(
    ".section.configuration > .card > .row"
  );

  const configElement = ({
    id,
    label,
    helper,
    placeholder,
    type = "number",
    columns = 6
  }) =>
    `

    <div class="item" style="grid-column: span ${columns}">
      <p>${helper}</p>
      <div class="input">
        <input
          id="build-${id}"
          type="${type}"
          placeholder="${placeholder}"
        />
        <p>${label}</p>
        <label for="build-${id}"></label>
      </div>

</div>
  `;

  const ruleElement = id =>
    `
    <div class="row">
      <div class="item">
        <div class="input">
            <input id="build-rule-${id}-left" type="text" placeholder="${
      id === 0 ? "X" : ""
    }"/>
            <p>#${id + 1} Left</p>
            <label for="build-rule-${id}-left"></label>
        </div>
        <div class="input">
          <input id="build-rule-${id}-right" type="text" placeholder="${
      id === 0 ? "F+[[X]-X]-F[-FX]+X" : ""
    }"/>
          <p>#${id + 1} Right</p>
          <label for="build-rule-${id}-right"></label>
        </div>
      </div>   
</div>`;
  FIELDS.rules = {};
  [...Array(MAX_RULES).keys()].forEach(i => {
    parentRules.insertAdjacentHTML("beforeend", ruleElement(i));
    FIELDS.rules[i] = [
      parentRules.querySelector(`input[id="build-rule-${i}-left"]`),
      parentRules.querySelector(`input[id="build-rule-${i}-right"]`)
    ];
  });

  [
    {
      id: "height",
      label: "Height",
      helper: "px",
      placeholder: "800",
      columns: 3
    },
    {
      id: "width",
      label: "Width",
      helper: "px",
      placeholder: "800",
      columns: 3
    },
    {
      id: "iterations",
      label: "Iterations",
      helper: "rounds",
      placeholder: "4",
      columns: 3
    },
    {
      id: "angle",
      label: "Angle",
      helper: "degrees",
      placeholder: "25",
      columns: 3
    },
    {
      id: "startSymbol",
      label: "Start symbol",
      helper: "",
      placeholder: "X",
      columns: 2,
      type: "text"
    },
    {
      id: "startSymbolX",
      label: "S coord X",
      helper: "px",
      placeholder: "400",
      columns: 2
    },
    {
      id: "startSymbolY",
      label: "S coord Y",
      helper: "px",
      placeholder: "400",
      columns: 2
    }
  ].forEach(e => {
    parentConfig.insertAdjacentHTML("beforeend", configElement({ ...e }));
    FIELDS[e.id] = parentConfig.querySelector(`input[id="build-${e.id}"]`);
  });

  console.log(FIELDS);

  dummyData();
}

function dummyData() {
  FIELDS.height.value = 800;
  FIELDS.width.value = 800;
  FIELDS.angle.value = 25;
  FIELDS.iterations.value = 4;
  FIELDS.startSymbol.value = "X";
  FIELDS.startSymbolX.value = 400;
  FIELDS.startSymbolY.value = 800;

  FIELDS.rules[0][0].value = "X";
  FIELDS.rules[0][1].value = "F+[[X]-X]-F[-FX]+X";

  FIELDS.rules[1][0].value = "F";
  FIELDS.rules[1][1].value = "FF";
}
