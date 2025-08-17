module.exports = (sequelize, DataTypes) => {
  return sequelize.define("producto", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_comercio: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING(255), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    imagen_url: { type: DataTypes.STRING(300), allowNull: true },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { timestamps: false, tableName: 'productos' });
};