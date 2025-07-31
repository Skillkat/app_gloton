const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const db = require("./models");
const session = require("express-session");
const { isAuthenticated } = require('./middleware/auth.middleware');

// Configurar sesión
app.use(session({
  secret: "admin123",
  resave: false,
  saveUninitialized: false,
}));

// Configurar Handlebars
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas públicas
app.use("/auth", require("./routes/auth.routes.js"));

// Rutas protegidas (requieren login)
app.use("/usuarios", isAuthenticated, require("./routes/usuario.routes"));
app.use("/clientes", isAuthenticated, require("./routes/clientes.routes"));
app.use("/comercios", isAuthenticated, require("./routes/comercios.routes"));
app.use("/deliverys", isAuthenticated, require("./routes/deliverys.routes"));
app.use("/productos", isAuthenticated, require("./routes/productos.routes"));
app.use("/pedidos", isAuthenticated, require("./routes/pedidos.routes"));
app.use("/detalle_pedidos", isAuthenticated, require("./routes/detalle_pedidos.routes"));

// Conexión a la base de datos
db.sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada");
  app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
});
