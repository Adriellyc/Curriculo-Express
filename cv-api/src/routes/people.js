const express = require("express");
const db = require("../db");
const router = express.Router();

// GET todas pessoas
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM people ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// GET pessoa por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await db.query("SELECT * FROM people WHERE id = $1", [id]);
    if (!person.rows.length) return res.status(404).json({ error: "Pessoa não encontrada" });
    res.json(person.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// POST criar pessoa
router.post("/", async (req, res) => {
  const { first_name, last_name, title, summary, email, phone, location } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO people (first_name,last_name,title,summary,email,phone,location) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [first_name, last_name, title, summary, email, phone, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pessoa" });
  }
});

// PUT atualizar pessoa
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, title, summary, email, phone, location } = req.body;
  try {
    const result = await db.query(
      "UPDATE people SET first_name=$1,last_name=$2,title=$3,summary=$4,email=$5,phone=$6,location=$7 WHERE id=$8 RETURNING *",
      [first_name, last_name, title, summary, email, phone, location, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Pessoa não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar pessoa" });
  }
});

// DELETE pessoa
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM people WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar pessoa" });
  }
});

module.exports = router;
