const db = require("../models");
const DetallePedido = db.DetallePedido;

exports.listarDetallePedidos = async (req, res) => {
  const detalles = await DetallePedido.findAll();
  res.render("detalle_pedidos/lista", { detalles });
};

exports.crearDetallePedido = async (req, res) => {
  const { id_pedido, id_producto, cantidad, precio_unitario } = req.body;
  await DetallePedido.create({ id_pedido, id_producto, cantidad, precio_unitario });
  res.redirect("/detalle_pedidos");
};
