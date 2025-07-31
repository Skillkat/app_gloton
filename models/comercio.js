module.exports = (sequelize, DataTypes) => {
    return sequelize.define("comercio", {
      id_comercio: { type: DataTypes.INTEGER, primaryKey: true },
      nombre_local: DataTypes.STRING(100),
      direccion: DataTypes.TEXT,
      telefono: DataTypes.STRING(20),
      horario_apertura: DataTypes.TIME,
      horario_cierre: DataTypes.TIME
    }, { timestamps: false });
  };
  