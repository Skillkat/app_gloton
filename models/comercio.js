module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comercio", {
    id_comercio: { type: DataTypes.INTEGER, primaryKey: true },
    nombre_local: { type: DataTypes.STRING(100), allowNull: true },
    correo: { type: DataTypes.STRING(255), allowNull: false },
    direccion: { type: DataTypes.TEXT, allowNull: true },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    horario_apertura: { type: DataTypes.TIME, allowNull: true },
    horario_cierre: { type: DataTypes.TIME, allowNull: true }
  }, { 
    timestamps: false,
    tableName: 'comercios'
  });
};