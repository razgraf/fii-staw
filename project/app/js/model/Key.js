import { ClassHelper, Store } from "./../../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../../base/config.js";

export default class Key {
  constructor(payload = {}) {
    if (ClassHelper.isEmpty(payload)) return;

    this.token = ClassHelper.sanitize(payload.token, "");
    this.quota = ClassHelper.sanitize(payload.quota, 0);
    this.createdAt = ClassHelper.sanitize(payload.createdAt, "");
  }

  static async assign() {
    const endpoint = new URL(API.ASSIGN_KEY);

    const params = {
      token: Store.get(STORE_KEYS.TOKEN)
    };

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(params)
    });

    return response;
  }

  static async getList() {
    const endpoint = new URL(API.LIST_KEYS);

    const params = {
      token: Store.get(STORE_KEYS.TOKEN)
    };

    Object.keys(params).forEach(key =>
      endpoint.searchParams.append(key, params[key])
    );

    const response = await fetch(endpoint, {
      method: "GET"
    });

    return response;
  }

  printElement(parent, isNew = false) {
    if (ClassHelper.isEmpty(parent)) return;

    const item = `<p data-new="${isNew}" class="key">${String(
      this.token
    )}<span> - ${
      this.quota === 1 ? "1 query" : `${String(this.quota)} queries`
    } left today</span> <i>(${this.createdAt})</i> </p>`;

    parent.insertAdjacentHTML("beforeend", item);
  }
}
