/**
 * @typedef {Object} Auth
 * @property {string} id - The unique user identification string
 * @property {token} token - The value which will determine the quota of a user
 */

/**
 * @typedef {Object} Identity
 * @property {string} name - The unique user identification string
 * @property {Object[]} history - A brief history of the recent usage of the token
 * @property {string} history[].timestamp - Time of creation for history item
 * @property {string} history[].action - Type of history item
 * @property {string} history[].payload - Extra data that can describe the action
 * @property {Object} quota - The remaining usage quota for that particular token
 * @property {string} quota.quantity - Remaining horse power
 * @property {string} quota.refresh - Timestamp for next quota refresh (if any)
 */

const URL_WHO = "who/";
const URL_


class FractalBuilder {

  get id(){return this._id;}
  set id(id){this._id = id;}  

  get token(){return this._token;}
  set token(id){this._token = token;}  


  constructor(auth) {
    if (!FractalBuilder.isAuthObjectValid(auth)) return;
    const { id, token } = auth;
    this.id = id;
    this.token = token;
  }

  /**
   *
   * @param {Auth} auth
   */
  static init(auth) {
    if (FractalBuilder.isAuthObjectValid(auth)) return null;
    return new FractalBuilder(auth);
  }

 who() {

    const headers = this.createAuthorization();
    const url = new URL(Config.API_ACTIVITY_GET_LIST);

  
    return fetch(url, {
      headers,
      credentials: "include",
      method: "GET"
    });
  }

 createRequestHeaders() {
    return new Headers({
      "CLIENT-AUTHORIZATION": JSON.stringify({id, token})
    });
  }


  static isAuthObjectValid(auth) {
    
    const { id, token } = auth;

    try {
      if (!id || !token) {
        console.error("FractalBuilder > Missing authenthiction data.");
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}
