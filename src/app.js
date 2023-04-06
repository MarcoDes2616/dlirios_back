const express = require("express")
const cors = require("cors");
const morgan = require("morgan");
const initModels = require("./models/initModels");
const db = require("./utils/database");
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

db.sync({ alter: false }) // alterar los atributos
  .then(() => console.log("Base de datos sync"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
    res.send("API de E-Commerce Dlirios Insumos");
  })

app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
})