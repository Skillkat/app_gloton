module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "admin123",
    DB: "app_gloton",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
