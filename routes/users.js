const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./chrome_ext_database.db");

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  db.get("SELECT * FROM users where id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json(row);
  });
});

router.get("/", (_req, res, next) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

router.post("/", (req, res, next) => {
  const { username, name, password } = req.body;

  const tempPassword = "Edupassword1_";

  db.run(
    "INSERT INTO users (username, name, password) VALUES (?,?,?)",
    [username, name, password ?? tempPassword],
    function (err, _result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
      });
    }
  );
});

router.patch("/:id", (req, res, next) => {
  const { username, name, password } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE users set username = ?, name = ?, password = ? WHERE id = ?`,
    [username, name, password, id],
    function (err, _result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.status(200).json({ updatedID: this.changes });
    }
  );
});

router.delete("/:id", (req, res, _next) => {
  db.run(
    `DELETE FROM users WHERE id = ?`,
    [req.params.id],
    function (err, _result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.status(200).json({ deletedID: this.changes });
    }
  );
});

module.exports = router;
