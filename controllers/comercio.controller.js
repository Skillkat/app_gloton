const db = require("../models");
const Comercio = db.Comercio;

exports.listarComercios = async (req, res) => {
  const comercios = await Comercio.findAll();
  res.render("comercios/lista", { comercios });
};

exports.crearComercio = async (req, res) => {
  const { id_comercio, nombre_local, direccion, telefono, horario_apertura, horario_cierre } = req.body;
  await Comercio.create({ id_comercio, nombre_local, direccion, telefono, horario_apertura, horario_cierre });
  res.redirect("/comercios");
};
