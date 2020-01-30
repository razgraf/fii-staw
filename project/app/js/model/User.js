import { ClassHelper, Store } from "./../../base/util.js";
import { API, ERRORS, HTTP_STATUS, STORE_KEYS } from "../../base/config.js";

class User {
  constructor(payload = {}) {
    if (ClassHelper.isEmpty(payload)) return;

    this.token = ClassHelper.sanitize(payload.token, "");
    this.email = ClassHelper.sanitize(payload.email, "");
  }

  static async getCredentials() {
    const endpoint = new URL(API.USER_PLATFORM_KEY);

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
}

export default User;
