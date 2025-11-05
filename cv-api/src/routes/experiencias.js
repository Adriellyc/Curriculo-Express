const express = require("express");
const db = require("../db");
const router = express.Router();

// GET todas experiências
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM experiencias ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// GET experiências de uma pessoa
router.get("/person/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM experiencias WHERE people_id=$1 ORDER BY id", [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar experiências" });
  }
});

// POST criar experiência
router.post("/", async (req, res) => {
  const { people_id, cargo, empresa, data_inicio, data_fim, descricao } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO experiencias (people_id,cargo,empresa,data_inicio,data_fim,descricao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [people_id, cargo, empresa, data_inicio, data_fim, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar experiência" });
  }
});

// PUT atualizar experiência
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).json({ error: "O corpo da requisição está vazio" });
  }

  const { people_id, cargo, empresa, data_inicio, data_fim, descricao } = req.body;

  if (!people_id) {
    return res.status(400).json({ error: "people_id é obrigatório" });
  }

  try {
    const result = await db.query(
      "UPDATE experiencias SET people_id=$1, cargo=$2, empresa=$3, data_inicio=$4, data_fim=$5, descricao=$6 WHERE id=$7 RETURNING *",
      [people_id, cargo, empresa, data_inicio, data_fim, descricao, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar experiência" });
  }
});

module.exports = router;
