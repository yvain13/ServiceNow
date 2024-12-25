# ServiceNow Todo Application

A modern, React-based Todo application that combines form-based record creation with a spreadsheet view of tasks.

## Features

- **Single Page Application**: Combines task creation and viewing in one interface
- **React-based Frontend**: Built with modern React and react-spreadsheet
- **Real-time Updates**: Table updates instantly when new tasks are added
- **Responsive Layout**: Split view with form (1/3) and spreadsheet (2/3)

## Components

### Frontend
- React components for modular design
- react-spreadsheet for data display
- Responsive CSS layout using flexbox
- Form validation for task creation

### Backend
- Express.js server
- File-based record storage using TypeScript
- RESTful API endpoints for CRUD operations

## Data Structure

Each todo record contains:
- Task description
- State (Ready, In Progress, Completed)
- Deadline date
- Unique ID

## API Endpoints

- `GET /get-records`: Retrieves all todo records
- `POST /update-record`: Creates a new todo record

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Technology Stack

- React 18
- Express.js
- react-spreadsheet
- Webpack 5
- Babel
- TypeScript (for record definitions)
