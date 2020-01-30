import { ClassHelper, Store, Alert } from "./../../base/util.js";
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
    this.access = ClassHelper.sanitize(payload.access, 1);

    console.log(this);
  }

  static async publish({ uuid }) {
    const endpoint = new URL(API.PUBLISH_FRACTAL);

    const body = {
      token: Store.get(STORE_KEYS.TOKEN),
      uuid
    };

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    });

    return response;
  }

  static async setPublic({ uuid }) {
    const endpoint = new URL(API.SET_FRACTAL_PUBLIC);

    const body = {
      token: Store.get(STORE_KEYS.TOKEN),
      uuid
    };

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    });

    return response;
  }

  static async setPrivate({ uuid }) {
    const endpoint = new URL(API.SET_FRACTAL_PRIVATE);

    const body = {
      token: Store.get(STORE_KEYS.TOKEN),
      uuid
    };

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    });

    return response;
  }

  static async getList(limit = 1000, offset = 0) {
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
    <div data-id="${this.identifier}" class="item fractal" data-publish="${
      this.access
    }">
        <div class="header">
          <p class="title">${this.name} <span>@${this.username}</span></p>
          ${
            this.self
              ? String(this.access) === "2"
                ? `<div class="actions"> <div class="action" data-type="private" title="Unpublish"> <i class="material-icons">visibility_off</i></div></div>`
                : String(this.access) === "1"
                ? `<div class="actions"> <div class="action" data-type="public"  title="Publish"> <i class="material-icons">visibility</i></div></div>`
                : ""
              : `<div class="actions"> <div class="action" data-type="vote"  title="Vote"> <i class="material-icons">thumb_up</i></div></div>`
          }
        </div>
        <div class="divider"></div>
        <div class="main">
          <a href="${
            this.image
          }" style="display:flex" class="content" target="_blank"><img alt="Loading..." src="${
      this.image
    }" /></a>
        </div>
      </div>`;

    parent.insertAdjacentHTML("beforeend", item);

    const element = parent.querySelector(`.item[data-id="${this.identifier}"]`);
    if (element) {
      if (this.self) {
        if (String(this.access) === "2") {
          const action = element.querySelector(".action[data-type='private']");
          action.onclick = async () => {
            action.dataset.loading = true;
            const result = await Fractal.setPrivate({ uuid: this.identifier });
            console.log(result);
            action.dataset.loading = false;
            if (result.status === HTTP_STATUS.OK) {
              window.location.reload(true);
            } else Alert.showAlert("Nope");
          };
        } else if (String(this.access) === "1") {
          const action = element.querySelector(".action[data-type='public']");
          action.onclick = async () => {
            action.dataset.loading = true;
            const result = await Fractal.setPublic({ uuid: this.identifier });
            console.log(result);
            action.dataset.loading = false;
            if (result.status === HTTP_STATUS.OK) {
              window.location.reload(true);
            } else Alert.showAlert("Nope");
          };
        }
      } else {
        const action = element.querySelector(".action[data-type='vote']");
        action.onclick = async () => {
          action.dataset.loading = true;
          const result = await Fractal.sendVote({ uuid: this.identifier });
          console.log(result);
          action.dataset.loading = false;
          if (result.status === HTTP_STATUS.OK) {
            window.location.reload(true);
          } else Alert.showAlert("Nope");
        };
      }
    } else console.warn("element ?? ");
  }

  static async sendVote({ uuid }) {
    Alert.showAlert("Voting not implemented yet..");
  }
}

export default Fractal;
