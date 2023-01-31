const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");

router.post("/", (_req, res, next) => {
  const db = new sqlite3.Database("./chrome_ext_database.db", (err) => {
    if (err) {
      console.error("Erro opening database " + err.message);
    } else {
      console.log("Connected to the SQlite database");
      db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, name TEXT, password TEXT)",
        (err) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }

          let insert =
            "INSERT OR IGNORE INTO users (username, name, password) VALUES (?,?,?)";

          const password = "Edupassword1_";
          const users = [
            ["acampos", "Alberto Campos", password],
            ["ctoxtli", "Carlos Toxtli", password],
            ["mrogers", "Matthew Rogers", password],
            ["rperera", "Ravindu Perera", password],
            ["cgendron", "Claire Gendron", password],
            ["vrios", "Victor Rios", password],
            ["cdelgado", "Cecilia Delgado", password],
          ];
          users.forEach((user) => {
            db.run(insert, user, function (err) {
              if (err) {
                res.status(400).json({ error: err.message });
              }
            });
          });
        }
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS tab_records (id INTEGER PRIMARY KEY AUTOINCREMENT, tab_id INTEGER, url TEXT, user_id INTEGER, open_at DATE, changed_at DATE, close_at DATE, FOREIGN KEY (user_id) REFERENCES users(id))",
        (err) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.status(200).json({ message: "Database seeded" });
        }
      );
    }
  });
});

module.exports = router;
