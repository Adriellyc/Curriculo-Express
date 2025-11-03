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
    res.status(500).json({ erro
