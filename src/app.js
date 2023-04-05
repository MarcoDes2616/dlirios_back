const express = require("express")
const cors = require("cors");
const morgan = require("morgan");

const app = express()

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 8000;


app.get("/", (req, res) => {
    res.send("API de E-Commerce Dlirios Insumos");
  })

app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
})