const express = require("express");
const router = express.Router();
const controller = require("../controllers/pedido.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/dashboard", authMiddleware.isAuthenticated, (req, res) => {
    res.render("dashboard", { usuario: req.session.usuario });
  });
  
  // Solo para admins
  router.get("/admin", authMiddleware.isTipo("admin"), (req, res) => {
    res.render("admin/panel", { usuario: req.session.usuario });
  });

router.get("/", controller.listarPedidos);
router.post("/crear", controller.crearPedido);

module.exports = router;
