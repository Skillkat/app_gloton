module.exports = (sequelize, DataTypes) => {
    return sequelize.define("delivery", {
      id_delivery: { type: DataTypes.INTEGER, primaryKey: true },
      telefono: DataTypes.STRING(20),
      vehiculo_tipo: DataTypes.STRING(50)
    }, { timestamps: false });
  };
  