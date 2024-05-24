
import React, { useState } from 'react';
import "./css/todo.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Todo()
{
    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState('');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");

    const changeMessage = (e) =>
    {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        if (message.trim() !== "" && selectedDate)
        {
            const obj = {
                text: message,
                id: new Date().getTime().toString(),
                checked: false,
                date: selectedDate
            };
            setList([...list, obj]);
            setMessage("");
            setSelectedDate(null);
        }
    };

    const handleDelete = (id) =>
    {
        setList(list.filter((eachItem) => eachItem.id !== id));
    }

    const clickHandler = (id, checked) =>
    {
        setList(list.map((item) =>
        {
            if (item.id === id)
            {
                return { ...item, checked: checked };
            }
            return item;
        }));
    }

    const handleEditChange = (e) =>
    {
        setEditText(e.target.value);
    };

    const handleEditSubmit = (id) =>
    {
        setList(list.map((item) =>
        {
            if (item.id === id)
            {
                return { ...item, text: editText };
            }
            return item;
        }));
        setEditId(null);
        setEditText('');
    };

    const zoomIn = () =>
    {
        setZoomLevel(prevZoomLevel => Math.min(prevZoomLevel + 10, 300));
    };

    const zoomOut = () =>
    {
        setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 10, 50));
    };

    const handleDateChange = (date) =>
    {
        setSelectedDate(date);
    };

    const toggleCalendar = () =>
    {
        setShowCalendar(prevState => !prevState);
    };

    const filteredTasks = list.filter(task =>
    {
        const dateMatch = task.date.toDateString() === selectedDate?.toDateString();
        const textMatch = task.text.toLowerCase().includes(search.toLowerCase());
        return dateMatch && textMatch;
    });

    const sortedTasks = [
        ...filteredTasks.filter(task => task.checked),
        ...filteredTasks.filter(task => !task.checked)
    ];

    return (
        <div className='main' style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>



            <div className="zoom-buttons">
                <button className="ZoomButton" onClick={zoomIn}>+</button>
                <button className="ZoomButton" onClick={zoomOut}>-</button>
            </div>
            <div className='body'>
                <h1>Todo</h1>

                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className='input'>
                        <input
                            type="text"
                            name="message"
                            id="message"
                            value={message}
                            onChange={changeMessage}
                            placeholder='Enter the task'
                        />
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={selectedDate ? selectedDate.toISOString().substr(0, 10) : ''}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            placeholder={selectedDate ? 'Selected Date' : 'Select Date'}
                        />
                        <button className='add' type="submit">
                            ADD
                        </button>
                        <input type="search" placeholder='Search by Name' value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className='result'>
                        <hr />
                        <ul>
                            {sortedTasks.length <= 0 && <h4>No tasks found !...</h4>}
                            {sortedTasks.map((item) => (
                                <li key={item.id} className={`list ${item.checked ? 'completed' : ''}`} style={{ listStyleType: "none" }}>
                                    <input type='checkbox' checked={item.checked} id="check" onChange={(e) => clickHandler(item.id, e.target.checked)} />
                                    {editId === item.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={handleEditChange}
                                            onBlur={() => handleEditSubmit(item.id)}
                                        />
                                    ) : (
                                        <span>{item.text}</span>
                                    )}
                                    <button className="del" type="button" onClick={() => handleDelete(item.id)}>
                                        DELETE
                                    </button>
                                    <button className="edit" type="button" onClick={() =>
                                    {
                                        setEditId(item.id);
                                        setEditText(item.text);
                                    }}>
                                        EDIT
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </form>
             

            </div>
            <div className='calci'>
            <button className="" id='calender' onClick={toggleCalendar}>
                    {showCalendar ? "Hide" : "Calendar"}
                </button>
                {showCalendar && (
                    <div className="calendar-container ">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                        />
                    </div>
                )}
            </div>

        </div>
    );
}

export default Todo