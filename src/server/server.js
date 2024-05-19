const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(cors());//обход CORS-блокировок

//получение всех задач
app.get("/tasks", (req, res) => {
    db.all("select * from tasks", (err, rows) => {
        if(err) {
            return res.status(500).json({error:err.message});
        }
        res.json(rows);
    })
})

//добавление новой задачи
app.post("/tasks", (req, res) => {
    //извлекаем данные из тела запроса
    const {title, deadline, priority} = req.body;
    db.run("insert into tasks(title, deadline, priority) values(?,?,?)", [title, deadline, priority], function(err) {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        //возвращаем id добавленной задачи
        res.json({id: this.lastID});
    })
})

//удаление задачи
app.delete("/tasks/:id", (req, res) => {
    const {id} = req.params;
    db.run("delete from tasks where id=?", id, function(err) {
        if(err) {
            res.status(500).json({error: err.message});
        }
        res.json({deleted: this.changes});
    })
})

//запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен по адресу: http://localhost:${port}`);
})