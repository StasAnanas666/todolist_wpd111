import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

const serverUrl = "http://localhost:3001/tasks";

const ToDoList = () => {
    const [todos, setTodos] = useState([]); //массив задач
    const [title, setTitle] = useState(""); //название задачи из поля ввода
    const [priority, setPriority] = useState("Low"); //приоритет задачи
    const [deadline, setDeadline] = useState(""); //время выполнения задачи

    //загрузка данных из бд при инициализации компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(serverUrl);
                setTodos(response.data);
            } catch (error) {
                console.error("Ошибка получения данных: ", error);
            }
        };

        fetchData();
    }, [todos]);

    //сохранение названия задачи из поля ввода в состояние
    const handleTasknameChange = (event) => {
        setTitle(event.target.value);
    };

    //сохранение значения приоритета
    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };

    //сохранение времени и даты дэдлайна
    const handleDeadlineChange = (event) => {
        setDeadline(event.target.value);
    };

    //добавление задачи
    const handleAddTask = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(serverUrl, {
                title: title,
                deadline: deadline,
                priority: priority,
            });
            console.log("Задача добавлена: ", response.data);
            setTitle("");
            setDeadline("");
            setPriority("Low");
        } catch (error) {
            console.error("Ошибка добавления данных: ", error);
        }
    };

    const handleDeleteTask = async(id) => {
        try {
            await axios.delete(`${serverUrl}/${id}`);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error("Ошибка удаления: ", error);
        }
    };

    //определение цвета строки в зависимости от выбранного приоритета
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Low":
                return "table-info";
            case "Medium":
                return "table-warning";
            case "High":
                return "table-danger";
            default:
                return "";
        }
    };

    //формитирование даты дэдлайна
    const formattedDateTime = (datetime) => {
        return datetime ? format(new Date(datetime), "dd/MM/yyyy HH:mm") : "";
    };

    return (
        <div className="container">
            <h1 className="mb-5">TODO</h1>

            <form onSubmit={handleAddTask}>
                <div className="d-flex justify-content-between align-items-center my-3">
                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ width: "92%" }}
                    >
                        <input
                            style={{ width: "60%" }}
                            type="text"
                            className="form-control"
                            placeholder="Введите название задачи..."
                            value={title}
                            onChange={handleTasknameChange}
                        />

                        <input
                            style={{ width: "20%" }}
                            type="datetime-local"
                            className="form-control"
                            value={deadline}
                            onChange={handleDeadlineChange}
                        />

                        <select
                            style={{ width: "15%" }}
                            className="form-select"
                            value={priority}
                            onChange={handlePriorityChange}
                        >
                            <option value="Low">Низкий</option>
                            <option value="Medium">Средний</option>
                            <option value="High">Высокий</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
            </form>

            <table className="table table-hover align-middle mt-5">
                <thead>
                    <tr>
                        <th className="w-50">Название</th>
                        <th>Дата выполнения</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => (
                        <tr
                            key={todo.id}
                            className={getPriorityColor(todo.priority)}
                        >
                            <td>{todo.title}</td>
                            <td>{formattedDateTime(todo.deadline)}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteTask(todo.id)}
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ToDoList;
