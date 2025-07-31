const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/dashboard", authMiddleware.isAuthenticated, (req, res) => {
    res.render("dashboard", { usuario: req.session.usuario });
  });
  
  // Solo para admins
  router.get("/admin", authMiddleware.isTipo("admin"), (req, res) => {
    res.render("admin/panel", { usuario: req.session.usuario });
  });

router.get("/login", authController.formLogin);
router.post("/login", authController.login);
router.get("/register", authController.formRegister);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

module.exports = router;
