import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File paths
const RECORDS_FILE = path.join(__dirname, 'data', 'records.json');
const RECORDS_TS_FILE = path.join(__dirname, 'src', 'fluent', 'record.now.ts');
const DEMO_RECORDS_FILE = path.join(__dirname, 'data', 'demo_records.json');

// Ensure records file exists
async function ensureRecordsFile() {
    try {
        await fs.access(RECORDS_FILE);
    } catch {
        // Create the data directory if it doesn't exist
        const dataDir = path.dirname(RECORDS_FILE);
        try {
            await fs.mkdir(dataDir, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
        // Create empty records file
        await fs.writeFile(RECORDS_FILE, JSON.stringify({ records: [] }));
    }
}

// Ensure demo records file exists
async function ensureDemoRecordsFile() {
    try {
        await fs.access(DEMO_RECORDS_FILE);
    } catch {
        // Create the data directory if it doesn't exist
        const dataDir = path.dirname(DEMO_RECORDS_FILE);
        try {
            await fs.mkdir(dataDir, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
        // Create empty demo records file
        await fs.writeFile(DEMO_RECORDS_FILE, JSON.stringify({ records: [] }));
    }
}

// Update TypeScript records file
async function updateTypeScriptRecords(records) {
    try {
        let tsContent = `import { Record } from '@servicenow/sdk/core';\n\n`;
        tsContent += `export const records = [\n`;

        records.forEach(record => {
            tsContent += `  Record({\n`;
            tsContent += `    table: 'x_1433234_racdmy_to_do',\n`;
            tsContent += `    $id: '${record.id}',\n`;
            tsContent += `    data: {\n`;
            tsContent += `      state: '${record.state}',\n`;
            tsContent += `      task: '${record.task}',\n`;
            tsContent += `      deadline: '${record.deadline}'\n`;
            tsContent += `    }\n`;
            tsContent += `  }),\n`;
        });

        tsContent += `];\n`;
        await fs.writeFile(RECORDS_TS_FILE, tsContent);
    } catch (error) {
        console.error('Error updating TypeScript records:', error);
        throw error;
    }
}

// Initialize records file
ensureRecordsFile().catch(console.error);
ensureDemoRecordsFile().catch(console.error);

// Get all records
app.get('/records', async (req, res) => {
    try {
        const data = await fs.readFile(RECORDS_FILE, 'utf8');
        const { records } = JSON.parse(data);
        res.json(records || []);
    } catch (error) {
        console.error('Error reading records:', error);
        res.status(500).json({ error: 'Failed to read records' });
    }
});

// Get all demo records
app.get('/demo-records', async (req, res) => {
    try {
        const data = await fs.readFile(DEMO_RECORDS_FILE, 'utf8');
        const { records } = JSON.parse(data);
        res.json(records || []);
    } catch (error) {
        console.error('Error reading demo records:', error);
        res.status(500).json({ error: 'Failed to read demo records' });
    }
});

// Add new record
app.post('/records', async (req, res) => {
    try {
        const newRecord = req.body;
        
        // Validate required fields
        if (!newRecord.task) {
            return res.status(400).json({ error: 'Task is required' });
        }

        // Read existing records
        const data = await fs.readFile(RECORDS_FILE, 'utf8');
        const { records = [] } = JSON.parse(data);
        
        // Generate new ID
        const maxId = records.reduce((max, record) => Math.max(max, parseInt(record.id) || 0), 0);
        newRecord.id = (maxId + 1).toString();
        
        // Set defaults for missing fields
        newRecord.state = newRecord.state || 'Ready';
        newRecord.deadline = newRecord.deadline || '';
        
        // Add new record
        records.push(newRecord);
        
        // Save updated records to both files
        await Promise.all([
            fs.writeFile(RECORDS_FILE, JSON.stringify({ records }, null, 2)),
            updateTypeScriptRecords(records)
        ]);
        
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ error: 'Failed to add record' });
    }
});

// Add new demo record
app.post('/demo-records', async (req, res) => {
    try {
        const newRecord = req.body;
        
        // Validate required fields
        if (!newRecord.task) {
            return res.status(400).json({ error: 'Task is required' });
        }

        // Read existing demo records
        const data = await fs.readFile(DEMO_RECORDS_FILE, 'utf8');
        const { records = [] } = JSON.parse(data);
        
        // Generate new ID
        const maxId = records.reduce((max, record) => {
            const id = parseInt(record.id.replace('demo_data_', ''));
            return isNaN(id) ? max : Math.max(max, id);
        }, 0);
        
        newRecord.id = `demo_data_${maxId + 1}`;
        
        // Set defaults for missing fields
        newRecord.state = newRecord.state || 'Ready';
        newRecord.deadline = newRecord.deadline || '';
        
        // Add new demo record
        records.push(newRecord);
        
        // Save updated demo records to file
        await fs.writeFile(DEMO_RECORDS_FILE, JSON.stringify({ records }, null, 2));
        
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error adding demo record:', error);
        res.status(500).json({ error: 'Failed to add demo record' });
    }
});

// Update record
app.put('/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRecord = req.body;
        
        // Read existing records
        const data = await fs.readFile(RECORDS_FILE, 'utf8');
        const { records = [] } = JSON.parse(data);
        
        // Find and update record
        const index = records.findIndex(record => record.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        // Update record while preserving id
        records[index] = { ...updatedRecord, id };
        
        // Save updated records to both files
        await Promise.all([
            fs.writeFile(RECORDS_FILE, JSON.stringify({ records }, null, 2)),
            updateTypeScriptRecords(records)
        ]);
        
        res.json(records[index]);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

// Update demo record
app.put('/demo-records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRecord = req.body;
        
        // Read existing demo records
        const data = await fs.readFile(DEMO_RECORDS_FILE, 'utf8');
        const { records = [] } = JSON.parse(data);
        
        // Find and update demo record
        const index = records.findIndex(record => record.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Demo record not found' });
        }
        
        // Update demo record while preserving id
        records[index] = { ...updatedRecord, id };
        
        // Save updated demo records to file
        await fs.writeFile(DEMO_RECORDS_FILE, JSON.stringify({ records }, null, 2));
        
        res.json(records[index]);
    } catch (error) {
        console.error('Error updating demo record:', error);
        res.status(500).json({ error: 'Failed to update demo record' });
    }
});

// Delete record
app.delete('/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Read existing records
        const data = await fs.readFile(RECORDS_FILE, 'utf8');
        const { records = [] } = JSON.parse(data);
        
        // Find and remove record
        const index = records.findIndex(record => record.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        records.splice(index, 1);
        
        // Save updated records to both files
        await Promise.all([
            fs.writeFile(RECORDS_FILE, JSON.stringify({ records }, null, 2)),
            updateTypeScriptRecords(records)
        ]);
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// Delete demo record
app.delete('/demo-records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Read existing demo records
        const data = await fs.readFile(DEMO_RECORDS_FILE, 'utf8');
        const { records = [] } = JSON.parse(data);
        
        // Find and remove demo record
        const index = records.findIndex(record => record.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Demo record not found' });
        }
        
        records.splice(index, 1);
        
        // Save updated demo records to file
        await fs.writeFile(DEMO_RECORDS_FILE, JSON.stringify({ records }, null, 2));
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting demo record:', error);
        res.status(500).json({ error: 'Failed to delete demo record' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
