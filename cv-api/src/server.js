const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const peopleRoutes = require("./routes/people");
const skillsRoutes = require("./routes/skills");
const formacoesRoutes = require("./routes/formacoes");
const experienciasRoutes = require("./routes/experiencias");
const projetosRoutes = require("./routes/projetos");

const db = require("./db"); // teste de conexão

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Teste de conexão com banco
db.query("SELECT NOW()")
  .then(res => console.log("Conexão com banco OK:", res.rows))
  .catch(err => console.error("Erro de conexão:", err));

app.use("/api/people", peopleRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/formacoes", formacoesRoutes);
app.use("/api/experiencias", experienciasRoutes);
app.use("/api/projetos", projetosRoutes);

app.get("/", (req, res) => res.send("CV API rodando 🚀"));

// Middleware de erro detalhado
app.use((err, req, res, next) => {
  console.error("Erro capturado:", err);
  res.status(500).json({ error: "Erro no servidor", message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
