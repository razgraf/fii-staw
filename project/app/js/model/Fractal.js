import { ClassHelper, Store } from "./../../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../../base/config.js";

class Fractal {
  constructor(payload = {}) {
    if (ClassHelper.isEmpty(payload)) return;

    this.self = ClassHelper.sanitize(payload.self, false);
    this.image = ClassHelper.sanitize(payload.image, "");
    this.timestamp = ClassHelper.sanitize(payload.timestamp, "");
    this.identifier = ClassHelper.sanitize(payload.identifier, "");
    this.reference = ClassHelper.sanitize(payload.reference, "");
    this.username = ClassHelper.sanitize(payload.username, "");
    this.name = ClassHelper.sanitize(payload.name, "");
    this.votes = ClassHelper.sanitize(payload.votes, 0);
    this.access = ClassHelper.sanitize(payload.votes, 1);

    console.log(this);
  }

  static async getList(limit = 50, offset = 0) {
    const endpoint = new URL(API.LIST_FRACTALS);

    const params = {
      token: Store.get(STORE_KEYS.TOKEN),
      limit,
      offset
    };

    Object.keys(params).forEach(key =>
      endpoint.searchParams.append(key, params[key])
    );

    const response = await fetch(endpoint, {
      method: "GET"
    });

    return response;
  }

  printElement(parent) {
    if (ClassHelper.isEmpty(parent)) return;

    const item = `
    <div data-id="${this.identifier}" class="item" data-publish="${
      this.access
    }">
        <div class="header">
          <p class="title">${this.name} <span>@${this.username}</span></p>
          ${
            this.self
              ? String(this.access) === "2"
                ? `<div class="actions"> <div class="action" title="Unpublish"> <i class="material-icons">visibility</i></div></div>`
                : String(this.access) === "1"
                ? `<div class="actions"> <div class="action" title="Publish"> <i class="material-icons">visibility_off</i></div></div>`
                : ""
              : ""
          }
        </div>
        <div class="divider"></div>
        <div class="main">
          <div class="content"><img alt="Loading..." src="${
            this.image
          }" /></div>
        </div>
      </div>`;

    parent.insertAdjacentHTML("beforeend", item);
  }
}

export default Fractal;
