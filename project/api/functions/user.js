const User = require("../system/User");
const { HTTP_STATUS, Generator } = require("../constants");

async function createUser(event) {
  try {
    const body = JSON.parse(event.body);

    const user = await User.create({ ...body });
    const token = await User.login({ ...body });

    return {
      statusCode: HTTP_STATUS.CREATED,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Created & Connected",
          token: token,
          username: user.username
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: e.message
        },
        null,
        2
      )
    };
  }
}

async function loginUser(event) {
  try {
    const body = JSON.parse(event.body);

    const token = await User.login({ ...body });

    const user = await User.get({ ...body });

    return {
      statusCode: HTTP_STATUS.OK,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: "Connected",
          token: token,
          username: user.username
        },
        null,
        2
      )
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      headers: Generator.headers(),
      body: JSON.stringify(
        {
          message: e.message
        },
        null,
        2
      )
    };
  }
}

module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
