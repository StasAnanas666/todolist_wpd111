import { useState, useEffect } from "react";
import { format } from "date-fns";

const ToDoList = () => {
    const [todos, setTodos] = useState([]); //массив задач
    const [taskname, setTaskname] = useState(""); //название задачи из поля ввода
    const [priority, setPriority] = useState("Low"); //приоритет задачи
    const [deadline, setDeadline] = useState(""); //время выполнения задачи
    //оставшееся время до дэдлайна
    // const [timeLeft, setTimeLeft] = useState({
    //     days: 0,
    //     hours: 0,
    //     minutes: 0,
    //     seconds: 0,
    // });

    //загрузка данных из localStorage при инициализации компонента
    useEffect(() => {
        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    //запись в localStorage при изменении списка задач
    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    }, [todos]);

    //подсчет оставшегося до сдачи задания времени
    // useEffect(() => {
    //     if (!deadline) return;
    //     const intervalId = setInterval(() => {
    //         const now = new Date();
    //         const target = new Date(deadline);
    //         const difference = target - now;

    //         if (difference <= 0) {
    //             clearInterval(intervalId);
    //             setTimeLeft({ days: 0, hours: 0, minutes: 0, second: 0 });
    //         } else {
    //             const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    //             const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    //             const minutes = Math.floor((difference / (1000 * 60)) % 60);
    //             const seconds = Math.floor((difference / 1000) % 60);
    //             setTimeLeft({ days, hours, minutes, seconds });
    //         }
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [deadline]);

    //сохранение названия задачи из поля ввода в состояние
    const handleTasknameChange = (event) => {
        setTaskname(event.target.value);
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
    const handleAddTask = () => {
        //обрезаем лишние символы в начале и конце строки
        if (taskname.trim() !== "") {
            //сохраняем новое значение в актуальный массив
            setTodos([
                ...todos,
                { title: taskname, deadline: deadline, priority: priority },
            ]);
            setTaskname("");
            setDeadline("");
            setPriority("Low");
        }
    };

    const handleDeleteTask = (index) => {
        //выбираем элементы, которе не хотим удалять, на их основе делем новый массив, передаем в состояние в качестве актуальног
        const newTodos = todos.filter((todo, i) => i !== index);
        setTodos(newTodos);
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
                        value={taskname}
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
                    onClick={handleAddTask}
                    className="btn btn-primary btn-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>

            <table className="table table-hover align-middle mt-5">
                <thead>
                    <tr>
                        <th className="w-50">Название</th>
                        <th>Дата выполнения</th>
                        {/* <th>Осталось</th> */}
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo, index) => (
                        <tr
                            key={index}
                            className={getPriorityColor(todo.priority)}
                        >
                            <td>{todo.title}</td>
                            <td>{formattedDateTime(todo.deadline)}</td>
                            {/* <td>
                                    {timeLeft.days > 0 &&
                                        `${timeLeft.days} дней `}
                                    {timeLeft.hours > 0 &&
                                        `${timeLeft.hours} часов `}
                                    {timeLeft.minutes > 0 &&
                                        `${timeLeft.minutes} минут `}
                                    {timeLeft.seconds > 0 &&
                                        `${timeLeft.seconds} секунд`}
                            </td> */}
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteTask(index)}
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
