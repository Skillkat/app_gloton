module.exports = (sequelize, DataTypes) => {
  return sequelize.define("delivery", {
    id_delivery: { type: DataTypes.INTEGER, primaryKey: true },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    vehiculo_tipo: { type: DataTypes.STRING(50), allowNull: true },
    correo: { type: DataTypes.STRING(255), allowNull: true }
  }, { 
    timestamps: false,
    tableName: 'deliveries'
  });
};