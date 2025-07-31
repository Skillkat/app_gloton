const express = require("express");
const router = express.Router();
const controller = require("../controllers/delivery.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/dashboard", authMiddleware.isAuthenticated, (req, res) => {
    res.render("dashboard", { usuario: req.session.usuario });
  });
  
  // Solo para admins
  router.get("/admin", authMiddleware.isTipo("admin"), (req, res) => {
    res.render("admin/panel", { usuario: req.session.usuario });
  });

router.get("/", controller.listarDeliverys);
router.post("/crear", controller.crearDelivery);

module.exports = router;
