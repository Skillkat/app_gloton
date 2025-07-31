const db = require("../models");
const Cliente = db.Cliente;

exports.listarClientes = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.render("clientes/lista", { clientes });
};

exports.crearCliente = async (req, res) => {
  const { id_cliente, direccion, telefono } = req.body;
  await Cliente.create({ id_cliente, direccion, telefono });
  res.redirect("/clientes");
};
