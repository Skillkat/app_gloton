module.exports = (sequelize, DataTypes) => {
    return sequelize.define("cliente", {
      id_cliente: { type: DataTypes.INTEGER, primaryKey: true },
      direccion: DataTypes.TEXT,
      telefono: DataTypes.STRING(20)
    }, { timestamps: false });
  };
  