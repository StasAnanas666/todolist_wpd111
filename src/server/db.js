const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./taskDb.db");

db.serialize(() => {
    db.run(
        "create table if not exists tasks(id integer primary key autoincrement, title text, deadline datetime, priority text)"
    );
});

module.exports = db;
