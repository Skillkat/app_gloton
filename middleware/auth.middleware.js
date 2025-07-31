// middleware/auth.middleware.js

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.usuario) {
      next();
    } else {
      res.redirect("/login");
    }
  };
  
  exports.isTipo = (tipoPermitido) => {
    return (req, res, next) => {
      if (req.session && req.session.usuario && req.session.usuario.tipo === tipoPermitido) {
        next();
      } else {
        res.status(403).send("Acceso no autorizado");
      }
    };
  };
  