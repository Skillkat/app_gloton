const db = require("../models");
const Usuario = db.Usuario;

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render("usuarios/lista", { usuarios });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, tipo } = req.body;
    const usuario = await Usuario.create({ nombre, correo, contrasena, tipo });
    res.redirect("/usuarios");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
