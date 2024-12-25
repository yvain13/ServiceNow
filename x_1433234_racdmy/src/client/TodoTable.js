import React, { useState, useCallback } from 'react';
import { ReactGrid } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';

const getColumns = () => [
    { columnId: 'id', width: 100 },
    { columnId: 'task', width: 400 },
    { columnId: 'state', width: 150 },
    { columnId: 'deadline', width: 150 }
];

const getHeaders = () => [
    {
        rowId: 'header',
        cells: [
            { type: 'header', text: 'ID' },
            { type: 'header', text: 'Task' },
            { type: 'header', text: 'Status' },
            { type: 'header', text: 'Deadline' }
        ]
    }
];

const getRows = (data = []) => {
    const rows = [
        ...getHeaders(),
        ...(Array.isArray(data) ? data : []).map((record) => ({
            rowId: record.id,
            cells: [
                { type: 'text', text: record.id || '', nonEditable: true },
                { type: 'text', text: record.task || '' },
                { type: 'text', text: record.state || '' },
                { type: 'text', text: record.deadline || '' }
            ]
        }))
    ];
    return rows;
};

const TodoTable = ({ data, onUpdate }) => {
    const [rows, setRows] = useState(() => getRows(data));
    const [columns] = useState(() => getColumns());
    const [pendingUpdates, setPendingUpdates] = useState(new Set());

    React.useEffect(() => {
        setRows(getRows(data));
    }, [data]);

    const handleChanges = useCallback(async (changes) => {
        const newRows = [...rows];
        const updates = [];

        // Collect all changes
        changes.forEach(change => {
            const changeRowIdx = newRows.findIndex(row => row.rowId === change.rowId);
            const changeColumnIdx = columns.findIndex(col => col.columnId === change.columnId);
            
            if (changeRowIdx > 0) { // Skip header row
                newRows[changeRowIdx].cells[changeColumnIdx].text = change.newCell.text;
                
                // Get the updated record
                const updatedRecord = {
                    id: newRows[changeRowIdx].rowId,
                    task: newRows[changeRowIdx].cells[1].text,
                    state: newRows[changeRowIdx].cells[2].text,
                    deadline: newRows[changeRowIdx].cells[3].text
                };

                // Add to updates if not already pending
                if (!pendingUpdates.has(updatedRecord.id)) {
                    updates.push(updatedRecord);
                    setPendingUpdates(prev => new Set([...prev, updatedRecord.id]));
                }
            }
        });
        
        setRows(newRows);

        // Process all updates
        try {
            await Promise.all(updates.map(async (record) => {
                const response = await fetch(`http://localhost:3000/records/${record.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(record)
                });

                if (!response.ok) {
                    throw new Error(`Failed to update record ${record.id}`);
                }
            }));

            // Clear pending updates after successful save
            setPendingUpdates(new Set());
            
            // Refresh the data
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating records:', error);
            // Revert changes on error
            setRows(getRows(data));
        }
    }, [rows, columns, onUpdate, data, pendingUpdates]);

    if (!Array.isArray(data)) {
        return (
            <div className="grid-container">
                <div className="empty-grid-message">No data available</div>
            </div>
        );
    }

    return (
        <div className="grid-container">
            <div className="table-header">
                <h2>Todo Records ({data.length})</h2>
                {pendingUpdates.size > 0 && (
                    <div className="saving-indicator">
                        Saving changes...
                    </div>
                )}
            </div>
            <ReactGrid
                rows={rows}
                columns={columns}
                onCellsChanged={handleChanges}
                enableColumnSelection={false}
                enableRowSelection={false}
                enableFillHandle={false}
                stickyTopRows={1}
            />
        </div>
    );
};

export default TodoTable;
