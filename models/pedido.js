module.exports = (sequelize, DataTypes) => {
    return sequelize.define("pedido", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_cliente: DataTypes.INTEGER,
      id_comercio: DataTypes.INTEGER,
      id_delivery: DataTypes.INTEGER,
      estado: {
        type: DataTypes.ENUM("pendiente", "preparando", "en camino", "entregado", "cancelado"),
        defaultValue: "pendiente"
      },
      fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { timestamps: false });
  };
  