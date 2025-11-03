const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const peopleRoutes = require("./routes/people");
const skillsRoutes = require("./routes/skills");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/people", peopleRoutes);
app.use("/api/skills", skillsRoutes);

app.get("/", (req, res) => {
  res.send("CV API está rodando 🚀");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
