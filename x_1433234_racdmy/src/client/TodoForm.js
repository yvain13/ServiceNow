import React, { useState } from 'react';

const TodoForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        task: '',
        state: 'Ready',
        deadline: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.task.trim()) {
            alert('Please enter a task');
            return;
        }
        onSubmit(formData);
        setFormData({
            task: '',
            state: 'Ready',
            deadline: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-group">
                <label htmlFor="task">Task</label>
                <input
                    type="text"
                    id="task"
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="state">Status</label>
                <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                >
                    <option value="Ready">Ready</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="submit-button">
                    Add Task
                </button>
            </div>
        </form>
    );
};

export default TodoForm;
