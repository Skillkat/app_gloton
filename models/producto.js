module.exports = (sequelize, DataTypes) => {
    return sequelize.define("producto", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_comercio: { type: DataTypes.INTEGER },
      nombre: DataTypes.STRING(255),
      descripcion: DataTypes.TEXT,
      precio: DataTypes.DECIMAL(10,2),
      imagen_url: DataTypes.STRING(300),
      disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { timestamps: false });
  };
  