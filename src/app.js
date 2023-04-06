const express = require("express")
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const productsRoutes = require("./routes/products.routes");
const initModels = require("./models/initModels");
const db = require("./utils/database");
const path = require('path');
const cancelOrdersJob = require("./utils/job");

initModels();
cancelOrdersJob();

const app = express()

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 8000;

db.authenticate()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => console.log(error));

db.sync({ alter: false })
  .then(() => console.log("Base de datos sync"))
  .catch((error) => console.log(error));

app.use(userRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(productsRoutes);
app.use(orderRoutes);


app.get("/", (req, res) => {
  res.send("API de E-Commerce Dlirios Insumos");
})

app.get('/app/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads', filename);
  res.sendFile(imagePath);
});

app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`);
})