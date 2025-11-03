const express = require("express");
const db = require("../db");
const router = express.Router();

// GET todos projetos
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM projetos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// GET projetos de uma pessoa
router.get("/person/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM projetos WHERE people_id = $1 ORDER BY id",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar projetos da pessoa" });
  }
});

// POST criar projeto
router.post("/", async (req, res) => {
  const { people_id, nome, descricao, link } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO projetos (people_id, nome, descricao, link) VALUES ($1,$2,$3,$4) RETURNING *",
      [people_id, nome, descricao, link]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar projeto" });
  }
});

// PUT atualizar projeto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { people_id, nome, descricao, link } = req.body;
  try {
    const result = await db.query(
      "UPDATE projetos SET people_id=$1, nome=$2, descricao=$3, link=$4 WHERE id=$5 RETURNING *",
      [people_id, nome, descricao, link, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
});

// DELETE projeto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM projetos WHERE id=$1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar projeto" });
  }
});

module.exports = router;
