const express = require("express");
const db = require("../db");
const router = express.Router();

// Lista todas as skills
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM skills ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Cria uma nova skill
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO skills (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar skill" });
  }
});

// Associa uma skill a uma pessoa com nível
router.post("/assign", async (req, res) => {
  const { person_id, skill_id, level } = req.body;
  try {
    await db.query(
      "INSERT INTO people_skills (person_id, skill_id, level) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
      [person_id, skill_id, level]
    );
    res.status(201).json({ message: "Skill associada à pessoa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao associar skill" });
  }
});

module.exports = router;
