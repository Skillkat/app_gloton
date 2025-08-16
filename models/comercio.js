module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comercio", {
    id_comercio: { type: DataTypes.INTEGER, primaryKey: true },
    nombre_local: { type: DataTypes.STRING(100), allowNull: false },
    correo: { type: DataTypes.STRING(255), allowNull: false },
    direccion: { type: DataTypes.TEXT, allowNull: false },
    telefono: { type: DataTypes.STRING(20) },
    horario_apertura: { type: DataTypes.TIME },
    horario_cierre: { type: DataTypes.TIME }
  }, { timestamps: false });
};