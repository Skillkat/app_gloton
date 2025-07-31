const db = require("../models");
const Delivery = db.Delivery;

exports.listarDeliverys = async (req, res) => {
  const deliverys = await Delivery.findAll();
  res.render("deliverys/lista", { deliverys });
};

exports.crearDelivery = async (req, res) => {
  const { id_delivery, telefono, vehiculo_tipo } = req.body;
  await Delivery.create({ id_delivery, telefono, vehiculo_tipo });
  res.redirect("/deliverys");
};
