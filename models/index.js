const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require("./usuario.js")(sequelize, DataTypes);
db.Cliente = require("./cliente.js")(sequelize, DataTypes);
db.Comercio = require("./comercio.js")(sequelize, DataTypes);
db.Delivery = require("./delivery.js")(sequelize, DataTypes);
db.Producto = require("./producto.js")(sequelize, DataTypes);
db.Pedido = require("./pedido.js")(sequelize, DataTypes);
db.DetallePedido = require("./detalle_pedido.js")(sequelize, DataTypes);

// Relaciones
db.Usuario.hasOne(db.Cliente, { foreignKey: "id_cliente", onDelete: "CASCADE" });
db.Usuario.hasOne(db.Comercio, { foreignKey: "id_comercio", onDelete: "CASCADE" });
db.Usuario.hasOne(db.Delivery, { foreignKey: "id_delivery", onDelete: "CASCADE" });

db.Comercio.hasMany(db.Producto, { foreignKey: "id_comercio" });

db.Cliente.hasMany(db.Pedido, { foreignKey: "id_cliente" });
db.Comercio.hasMany(db.Pedido, { foreignKey: "id_comercio" });
db.Delivery.hasMany(db.Pedido, { foreignKey: "id_delivery" });

db.Pedido.hasMany(db.DetallePedido, { foreignKey: "id_pedido" });
db.Producto.hasMany(db.DetallePedido, { foreignKey: "id_producto" });

module.exports = db;
