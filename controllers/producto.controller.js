const db = require("../models");
const Producto = db.Producto;

exports.listarProductos = async (req, res) => {
  const productos = await Producto.findAll();
  res.render("productos/lista", { productos });
};

exports.crearProducto = async (req, res) => {
  const { id_comercio, nombre, descripcion, precio, imagen_url } = req.body;
  await Producto.create({ id_comercio, nombre, descripcion, precio, imagen_url });
  res.redirect("/productos");
};
