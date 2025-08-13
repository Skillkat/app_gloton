const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const db = require("./models");
const session = require("express-session");
const path = require("path");

// Importar middlewares
const { isAuthenticated } = require("./middlewares/auth.middleware");

// Importar rutas
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const clienteRoutes = require('./routes/clientes.routes');
const comercioRoutes = require('./routes/comercios.routes');
const deliveryRoutes = require('./routes/deliverys.routes');

// Configurar sesión
app.use(session({
  secret: "admin123",
  resave: false,
  saveUninitialized: false,
}));

// Middlewares de parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas públicas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Rutas según tipo de usuario (no autenticadas)
app.use('/cliente', clienteRoutes);
app.use('/comercio', comercioRoutes);
app.use('/delivery', deliveryRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/admin', isAuthenticated, adminRoutes);
app.use("/usuarios", isAuthenticated, require("./routes/usuario.routes"));
app.use("/clientes", isAuthenticated, require("./routes/clientes.routes"));
app.use("/comercios", isAuthenticated, require("./routes/comercios.routes"));
app.use("/deliverys", isAuthenticated, require("./routes/deliverys.routes"));
app.use("/productos", isAuthenticated, require("./routes/productos.routes"));
app.use("/pedidos", isAuthenticated, require("./routes/pedidos.routes"));
app.use("/detalle_pedidos", isAuthenticated, require("./routes/detalle_pedidos.routes"));

// Ruta 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Conexión a la base de datos
db.sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada");
  app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
});
