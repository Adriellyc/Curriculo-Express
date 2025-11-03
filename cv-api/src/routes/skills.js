const express = require("express");
const db = require("../db");
const router = express.Router();

// GET todas skills
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM skills ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// GET skills de uma pessoa
router.get("/person/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT s.id, s.name, ps.level
       FROM skills s
       JOIN people_skills ps ON s.id = ps.skill_id
       WHERE ps.person_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar skills da pessoa" });
  }
});

// POST criar skill
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query("INSERT INTO skills (name) VALUES ($1) RETURNING *", [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar skill" });
  }
});

// POST associar skill a pessoa
router.post("/assign", async (req, res) => {
  const { person_id, skill_id, level } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO people_skills (person_id, skill_id, level) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING *",
      [person_id, skill_id, level]
    );
    if (!result.rows.length) return res.status(409).json({ message: "Associação já existe" });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao associar skill" });
  }
});

// DELETE skill
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM skills WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar skill" });
  }
});

module.exports = router;
