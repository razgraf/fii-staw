const Sequelize = require("sequelize");
const { t: typy } = require("typy");

class Networking {
  static initialize() {
    return new Sequelize(
      process.env.S_AWS_RDS_FRACTAL_DATABASE,
      process.env.S_AWS_RDS_FRACTAL_USERNAME,
      process.env.S_AWS_RDS_FRACTAL_PASSWORD,
      {
        host: process.env.S_AWS_RDS_FRACTAL_HOST,
        dialect: "mysql",
        port: process.env.S_AWS_RDS_FRACTAL_PORT,
        charset: "latin1",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
  }

  static async getFractalFromDB({ id, uuid }) {
    const DB = Networking.initialize();

    if (id) {
      const list = await DB.query(`SELECT * FROM fractal WHERE id = :id`, {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (uuid) {
      const list = await DB.query(`SELECT * FROM fractal WHERE uuid = :uuid`, {
        replacements: { uuid },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    console.warn("Missing data. Cannot find fractal without identifiers.");

    return null;
  }

  static async insertFractalIntoDB({
    name = "Fractal",
    definition,
    hash,
    userId
  }) {
    const DB = Networking.initialize();

    const response = await DB.query(
      `
        INSERT INTO fractal
        SET
        uuid = UUID(),
        name = :name,
        definition = :definition,
        userId = :userId,
        hash  = :hash
    `,
      {
        replacements: { name, definition, userId, hash },
        type: Sequelize.QueryTypes.INSERT
      }
    );

    console.log(response);

    if (!response) return null;

    return await Networking.getFractalFromDB({ id: response[0] });
  }

  static async insertUserIntoDB({ username, email, password: hashedPassword }) {
    const DB = Networking.initialize();

    const response = await DB.query(
      `
        INSERT INTO user
        SET
        uuid = UUID(),
        username = :username,
        email = :email,
        password = :password
    `,
      {
        replacements: { username, email, password: hashedPassword },
        type: Sequelize.QueryTypes.INSERT
      }
    );

    console.log(response);

    if (!response) return null;

    return await Networking.getUserFromDB({ id: response[0] });
  }

  static async getUserFromDB({ id, uuid, email, username }) {
    const DB = Networking.initialize();

    if (typy(id).isTruthy) {
      const list = await DB.query(`SELECT * FROM user WHERE id = :id`, {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (typy(uuid).isTruthy) {
      const list = await DB.query(`SELECT * FROM user WHERE uuid = :uuid`, {
        replacements: { uuid },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (typy(email).isTruthy) {
      const list = await DB.query(`SELECT * FROM user WHERE email = :email`, {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (typy(username).isTruthy) {
      const list = await DB.query(
        `SELECT * FROM user WHERE username = :username`,
        {
          replacements: { username },
          type: Sequelize.QueryTypes.SELECT
        }
      );
      return list.length > 0 ? list[0] : null;
    }
    return null;
  }

  static async insertKeyIntoDB({ token, userId, platform = 0 }) {
    const DB = Networking.initialize();

    const response = await DB.query(
      `INSERT INTO public_key SET token = :token, userId = :userId, platform = :platform`,
      {
        replacements: {
          token: token,
          userId: userId,
          platform: platform === 1 ? 1 : 0
        },
        type: Sequelize.QueryTypes.INSERT
      }
    );

    console.log(response);

    if (!response) return null;

    return await Networking.getKeyFromDB({ id: response[0] });
  }

  static async getKeyFromDB({ id }) {
    const DB = Networking.initialize();

    const list = await DB.query(`SELECT * FROM public_key WHERE id = :id`, {
      replacements: { id },
      type: Sequelize.QueryTypes.SELECT
    });
    return list.length > 0 ? list[0] : null;
  }

  static async getLibraryKeyFromDB({ userId, token }) {
    const DB = Networking.initialize();

    const list = await DB.query(
      `SELECT * FROM public_key WHERE userId = :userId AND token = :token`,
      {
        replacements: { userId, token },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    return list.length > 0 ? list[0] : null;
  }

  static async spendKeyQuotaIntoDB({ id }) {
    const DB = Networking.initialize();

    const response = await DB.query(
      `UPDATE public_key SET quota = quota - 1 WHERE id = :id`,
      {
        replacements: {
          id
        },
        type: Sequelize.QueryTypes.UPDATE
      }
    );

    console.log(response);

    if (!response) return null;
    return Networking.getKeyFromDB({ id });
  }

  static async getKeyListFromDB({ userId }) {
    const DB = Networking.initialize();

    const list = await DB.query(
      `SELECT * FROM public_key WHERE userId = :userId AND platform = 0`,
      {
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    return list.length > 0 ? list : [];
  }

  static async matchUserKeyFromDB({ userUuid, token }) {
    const DB = Networking.initialize();

    const response = await DB.query(
      `SELECT * 
      FROM public_key pk 
      INNER JOIN user u ON u.id = pk.userId 
      WHERE u.uuid = :uuid AND pk.token = :token `,
      {
        replacements: { uuid: userUuid, token },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    return typy(response).isTruthy;
  }
}

module.exports = Networking;
