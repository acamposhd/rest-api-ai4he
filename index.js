const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const userRoute = require("./routes/users");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use("/users", userRoute);

const db = new sqlite3.Database("./chrome_ext_database.db", (err) => {
  if (err) {
    console.error("Erro opening database " + err.message);
  } else {
    console.log("Connected to the SQlite database");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, name TEXT, password TEXT)",
      (err) => {
        if (err) {
          console.log("Table already exists.", err);
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
              return console.error(err.message);
            }
          });
        });
      }
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS tab_records (id INTEGER PRIMARY KEY AUTOINCREMENT, tab_id INTEGER, url TEXT, user_id INTEGER, first_visit DATE, last_visit DATE, FOREIGN KEY (user_id) REFERENCES users(id))",
      (err) => {
        if (err) {
          console.log("Table  tab_records already exists.", err);
        }
      }
    );
  }
});

app.listen(process.env.PORT || 3333);
