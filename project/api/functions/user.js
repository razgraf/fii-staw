const User = require("../system/User");
const { HTTP_STATUS } = require("../constants");

async function createUser(event) {
  try {
    console.log("Body", event.body);

    const body = JSON.parse(JSON.stringify(event.body));

    const created = await User.create(body);

    return {
      statusCode: HTTP_STATUS.CREATED,
      body: JSON.stringify(
        {
          message: "Created"
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      body: JSON.stringify(
        {
          error: {
            name: e.name,
            message: e.message,
            string: e.toString()
          },
          body: event.body
        },
        null,
        2
      )
    };
  }
}

async function loginUser(event) {}

module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
