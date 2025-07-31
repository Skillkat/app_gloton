module.exports = (sequelize, DataTypes) => {
    return sequelize.define("usuario", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      correo: { type: DataTypes.STRING, allowNull: false, unique: true },
      contrasena: { type: DataTypes.STRING, allowNull: false },
      tipo: { type: DataTypes.ENUM("cliente", "comercio", "delivery", "admin"), allowNull: false },
      creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { timestamps: false });
  };
  