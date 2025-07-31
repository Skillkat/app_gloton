const db = require("../models");
const bcrypt = require("bcryptjs");

const Usuario = db.Usuario;
const Cliente = db.Cliente;
const Comercio = db.Comercio;
const Delivery = db.Delivery;


// Mostrar formularios
exports.formLogin = (req, res) => res.render("auth/login");
exports.formRegister = (req, res) => res.render("auth/register");

// Registro
exports.register = async (req, res) => {
  const { nombre, correo, contrasena, tipo, direccion, telefono, vehiculo_tipo, nombre_local, horario_apertura, horario_cierre } = req.body;

  try {
    // Verificar si el correo ya existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.render("auth/register", { error: "El correo ya está registrado." });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const usuario = await Usuario.create({ nombre, correo, contrasena: hashedPassword, tipo });

    // Crear registro específico según el tipo
    if (tipo === "cliente") {
      await Cliente.create({ id_cliente: usuario.id, direccion, telefono });
    } else if (tipo === "comercio") {
      await Comercio.create({
        id_comercio: usuario.id,
        nombre_local,
        direccion,
        telefono,
        horario_apertura,
        horario_cierre
      });
    } else if (tipo === "delivery") {
      await Delivery.create({ id_delivery: usuario.id, telefono, vehiculo_tipo });
    }

    res.redirect("/login");
  } catch (error) {
    res.render("auth/register", { error: "Error al registrar usuario.", detalles: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.render("auth/login", { error: "Usuario no encontrado." });
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) {
      return res.render("auth/login", { error: "Contraseña incorrecta." });
    }

    req.session.usuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        correo: usuario.correo,
      };
      exports.logout = (req, res) => {
        req.session.destroy(() => {
          res.redirect("/login");
        });
      };
      res.redirect("/dashboard");
  } catch (error) {
    res.render("auth/login", { error: "Error en login.", detalles: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.redirect("/login");
};
