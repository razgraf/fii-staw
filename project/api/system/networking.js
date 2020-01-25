const Sequelize = require("sequelize");

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

  static async insertFractalIntoDB({ name = "Fractal", definition }) {
    const DB = Networking.initialize();

    const response = await DB.query(
      `
        INSERT INTO fractal
        SET
        uuid = UUID(),
        name = :name,
        definition = :definition
    `,
      {
        replacements: { name, definition },
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

    if (id) {
      const list = await DB.query(`SELECT * FROM user WHERE id = :id`, {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (uuid) {
      const list = await DB.query(`SELECT * FROM user WHERE uuid = :uuid`, {
        replacements: { uuid },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (email) {
      const list = await DB.query(`SELECT * FROM user WHERE email = :email`, {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT
      });
      return list.length > 0 ? list[0] : null;
    }

    if (username) {
      const list = await DB.query(
        `SELECT * FROM user WHERE username = :username`,
        {
          replacements: { username },
          type: Sequelize.QueryTypes.SELECT
        }
      );
      return list.length > 0 ? list[0] : null;
    }

    console.warn("Missing data. Cannot find user without identifiers.");

    return null;
  }
}

module.exports = Networking;
