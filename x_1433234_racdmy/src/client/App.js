import React, { useState, useEffect } from 'react';
import TodoTable from './TodoTable.js';
import TodoForm from './TodoForm.js';
import TodoCharts from './TodoCharts.js';

const App = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/records');
            if (!response.ok) {
                throw new Error('Failed to fetch records');
            }
            const data = await response.json();
            setRecords(Array.isArray(data) ? data : []);
            setError(null);
        } catch (error) {
            console.error('Error fetching records:', error);
            setError('Failed to load records. Please try again later.');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleAddRecord = async (newRecord) => {
        try {
            const response = await fetch('http://localhost:3000/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord),
            });

            if (!response.ok) {
                throw new Error('Failed to add record');
            }

            fetchRecords(); // Refresh the records
        } catch (error) {
            console.error('Error adding record:', error);
            alert('Failed to add record. Please try again.');
        }
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <h1>ServiceNow Todo Manager</h1>
                <p className="subtitle">Manage your tasks efficiently</p>
            </header>
            
            <main className="main-content">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : loading ? (
                    <div className="loading-message">Loading...</div>
                ) : (
                    <>
                        <div className="form-section">
                            <TodoForm onSubmit={handleAddRecord} />
                        </div>
                        <div className="table-section">
                            <TodoTable data={records} onUpdate={fetchRecords} />
                        </div>
                        <div className="charts-section">
                            <TodoCharts data={records} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
