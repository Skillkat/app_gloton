const db = require("../models");
const Pedido = db.Pedido;

exports.listarPedidos = async (req, res) => {
  const pedidos = await Pedido.findAll();
  res.render("pedidos/lista", { pedidos });
};

exports.crearPedido = async (req, res) => {
  const { id_cliente, id_comercio, id_delivery, estado } = req.body;
  await Pedido.create({ id_cliente, id_comercio, id_delivery, estado });
  res.redirect("/pedidos");
};
