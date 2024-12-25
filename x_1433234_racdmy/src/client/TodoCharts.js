import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = {
    'Ready': '#2196F3',
    'In Progress': '#FFA000',
    'Completed': '#43A047'
};

const TodoCharts = ({ data }) => {
    // Ensure data is an array
    const safeData = Array.isArray(data) ? data : [];

    // Prepare data for status distribution
    const statusData = Object.entries(
        safeData.reduce((acc, record) => {
            const state = record.state || 'Unknown';
            acc[state] = (acc[state] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    // Prepare data for deadline distribution
    const deadlineData = safeData.reduce((acc, record) => {
        if (record.deadline) {
            const month = new Date(record.deadline).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
    }, {});

    const deadlineChartData = Object.entries(deadlineData)
        .map(([month, count]) => ({
            month,
            tasks: count
        }))
        .sort((a, b) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.indexOf(a.month) - months.indexOf(b.month);
        });

    if (!safeData.length) {
        return (
            <div className="charts-container">
                <h2>Task Analytics</h2>
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>Status Distribution</h3>
                        <div className="empty-chart-message">No data available</div>
                    </div>
                    <div className="chart-card">
                        <h3>Tasks by Deadline</h3>
                        <div className="empty-chart-message">No data available</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="charts-container">
            <h2>Task Analytics</h2>
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[entry.name] || '#8884d8'} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Tasks by Deadline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={deadlineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tasks" fill="#2E7D32" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TodoCharts;
