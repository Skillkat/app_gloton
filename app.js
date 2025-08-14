const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const db = require("./models");
const session = require("express-session");
const path = require("path");
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

const { isAuthenticated, isAdmin, isTipo } = require("./middlewares/auth.middleware");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const clientesRoutes = require('./routes/clientes.routes');
const comerciosRoutes = require('./routes/comercios.routes');
const deliverysRoutes = require('./routes/deliverys.routes');
const clientesAdminRoutes = require('./routes/clientes.routes');
const comerciosAdminRoutes = require('./routes/comercios.routes');
const deliverysAdminRoutes = require('./routes/deliverys.routes');

app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret_fallback",
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Rutas públicas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Rutas por tipo de usuario
app.use('/cliente', isAuthenticated, isTipo('cliente'), clientesRoutes);
app.use('/comercio', isAuthenticated, isTipo('comercio'), comerciosRoutes);
app.use('/delivery', isAuthenticated, isTipo('delivery'), deliverysRoutes);

// Rutas protegidas (solo admin)
app.use('/admin', isAdmin, adminRoutes);
app.use("/usuarios", isAdmin, require("./routes/usuario.routes"));
app.use("/clientes", isAdmin, clientesAdminRoutes);
app.use("/comercios", isAdmin, comerciosAdminRoutes);
app.use("/deliverys", isAdmin, deliverysAdminRoutes);
app.use("/productos", isAdmin, require("./routes/productos.routes"));
app.use("/pedidos", isAdmin, require("./routes/pedidos.routes"));
app.use("/detalle_pedidos", isAdmin, require("./routes/detalle_pedidos.routes"));

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).render('error', { message: 'Token CSRF inválido' });
  } else {
    res.status(500).render('error', { message: 'Error interno del servidor' });
  }
});

// Ruta 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página no encontrada' });
});

// Conexión a la base de datos
db.sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
}).catch(err => {
  console.error("Error al sincronizar DB:", err);
});
