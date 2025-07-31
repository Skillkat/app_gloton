const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/dashboard", authMiddleware.isAuthenticated, (req, res) => {
    res.render("dashboard", { usuario: req.session.usuario });
  });

  // Solo para admins
  router.get("/admin", authMiddleware.isTipo("admin"), (req, res) => {
    res.render("admin/panel", { usuario: req.session.usuario });
  });

router.get("/", usuarioController.listarUsuarios);
router.post("/crear", usuarioController.crearUsuario);

module.exports = router;
