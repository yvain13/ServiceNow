let spreadsheet;

// Function to load and display records
async function loadRecords() {
    try {
        const response = await fetch('http://localhost:3000/get-records');
        const records = await response.json();

        const data = records.map(record => [
            record.id,
            record.task,
            record.state,
            record.deadline
        ]);

        if (spreadsheet) {
            spreadsheet.setData(data);
        } else {
            spreadsheet = jspreadsheet(document.getElementById('spreadsheet'), {
                data: data,
                columns: [
                    { type: 'text', title: 'ID', width: 120, readOnly: true },
                    { type: 'text', title: 'Task', width: 300, readOnly: true },
                    { 
                        type: 'dropdown', 
                        title: 'State', 
                        width: 120,
                        source: ['Ready', 'In Progress', 'Completed'],
                        readOnly: true
                    },
                    { type: 'calendar', title: 'Deadline', width: 120, readOnly: true }
                ],
                style: {
                    A1: 'background-color: #f8f9fa;',
                    B1: 'background-color: #f8f9fa;',
                    C1: 'background-color: #f8f9fa;',
                    D1: 'background-color: #f8f9fa;'
                },
                tableOverflow: true,
                tableWidth: "100%",
                tableHeight: "400px"
            });
        }
    } catch (error) {
        console.error('Error loading records:', error);
    }
}

// Load records when page loads
document.addEventListener('DOMContentLoaded', loadRecords);

// Handle form submission
document.getElementById('todoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const responseDiv = document.getElementById('response');
    const task = document.getElementById('task').value;
    const state = document.getElementById('state').value;
    const deadline = document.getElementById('deadline').value;

    try {
        const response = await fetch('http://localhost:3000/update-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task,
                state,
                deadline
            })
        });

        if (response.ok) {
            responseDiv.className = 'success';
            responseDiv.textContent = 'Success: Todo item created!';
            document.getElementById('todoForm').reset();
            
            // Reload the records table
            await loadRecords();
        } else {
            throw new Error('Failed to create todo item');
        }
    } catch (error) {
        responseDiv.className = 'error';
        responseDiv.textContent = `Error: ${error.message}`;
    }
});
