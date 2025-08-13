exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuarioId) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};



// Middleware para verificar si el usuario tiene uno o varios roles permitidos

exports.isTipo = (tiposPermitidos) => {
  return (req, res, next) => {
    if (!req.session || !req.session.usuarioTipo) {
      return res.status(401).send("No autenticado");
    }

    const tipos = Array.isArray(tiposPermitidos) ? tiposPermitidos : [tiposPermitidos];

    if (tipos.includes(req.session.usuarioTipo)) {
      return next();
    }

    return res.status(403).send("Acceso no autorizado");
  };
};
