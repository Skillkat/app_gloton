module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cliente", {
    id_cliente: { type: DataTypes.INTEGER, primaryKey: true }, // Mantén id_cliente
    nombre: { type: DataTypes.STRING, allowNull: false }, // Asegurado
    correo: { type: DataTypes.STRING, allowNull: false }, // Asegurado
    direccion: DataTypes.TEXT,
    telefono: DataTypes.STRING(20)
  }, { timestamps: false });
};