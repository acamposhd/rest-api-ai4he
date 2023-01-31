const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./chrome_ext_database.db");

router.get("/", (_req, res, next) => {
  db.all("SELECT * FROM tab_records", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  db.get("SELECT * FROM tab_records where id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json(row);
  });
});

router.get("/user/:userId", (req, res, next) => {
  const { userId } = req.params;
  db.all(
    "SELECT * FROM tab_records where user_id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ rows });
    }
  );
});

router.post("/", (req, res, next) => {
  const { tab_id, url, user_id } = req.body;

  const open_at = new Date().toISOString();

  db.run(
    "INSERT INTO tab_records (tab_id, url, user_id, open_at ) VALUES (?,?,?,?)",
    [tab_id, url, user_id, open_at],
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
  const { tab_id, url, user_id, open_at, changed_at, closed_at } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE tab_records set tab_id = ?, url = ?, user_id = ?, open_at = ?, changed_at = ?, closed_at = ? WHERE id = ?`,
    [tab_id, url, user_id, open_at, changed_at, closed_at, id],
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
    `DELETE FROM tab_records WHERE id = ?`,
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
