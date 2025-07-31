module.exports = (sequelize, DataTypes) => {
    return sequelize.define("detalle_pedido", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_pedido: DataTypes.INTEGER,
      id_producto: DataTypes.INTEGER,
      cantidad: DataTypes.INTEGER,
      precio_unitario: DataTypes.DECIMAL(10,2)
    }, { timestamps: false });
  };
  