const express = require("express");
const db = require("../db");
const router = express.Router();

// GET todas formações
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM formacoes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// GET formações de uma pessoa
router.get("/person/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM formacoes WHERE people_id=$1 ORDER BY id", [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar formações" });
  }
});

// POST criar formação
router.post("/", async (req, res) => {
  const { people_id, curso, instituicao, ano_inicio, ano_fim, descricao } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO formacoes (people_id,curso,instituicao,ano_inicio,ano_fim,descricao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [people_id, curso, instituicao, ano_inicio, ano_fim, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar formação" });
  }
});

// PUT atualizar formação
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { people_id, curso, instituicao, ano_inicio, ano_fim, descricao } = req.body;
  try {
    const result = await db.query(
      "UPDATE formacoes SET people_id=$1,curso=$2,instituicao=$3,ano_inicio=$4,ano_fim=$5,descricao=$6 WHERE id=$7 RETURNING *",
      [people_id, curso, instituicao, ano_inicio, ano_fim, descricao, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar formação" });
  }
});

// DELETE formação
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM formacoes WHERE id=$1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar formação" });
  }
});

module.exports = router;
