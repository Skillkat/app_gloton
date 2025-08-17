module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cliente", {
    id_cliente: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    correo: { type: DataTypes.STRING(255), allowNull: false },
    direccion: { type: DataTypes.TEXT, allowNull: true },
    telefono: { type: DataTypes.STRING(20), allowNull: true }
  }, { 
    timestamps: false,
    tableName: 'clientes'
  });
};