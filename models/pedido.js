module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('pedido', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_cliente: { type: DataTypes.INTEGER, allowNull: false },
    id_comercio: { type: DataTypes.INTEGER, allowNull: false },
    id_delivery: { type: DataTypes.INTEGER, allowNull: true },
    estado: {
      type: DataTypes.ENUM('pendiente', 'preparando', 'en camino', 'entregado', 'cancelado'),
      defaultValue: 'pendiente'
    },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { timestamps: false });

  // Asociaciones
  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Cliente, { foreignKey: 'id_cliente' });
    Pedido.belongsTo(models.Comercio, { foreignKey: 'id_comercio' });
    Pedido.belongsTo(models.Delivery, { foreignKey: 'id_delivery' });
  };

  return Pedido;
};