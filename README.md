# Tauri Kanban Board

A minimal Kanban board task manager built with Tauri, React, and TypeScript.

## Features

- **Three-column Kanban board**: To Do, In Progress, Done
- **Drag and drop functionality**: Move tasks between columns using @hello-pangea/dnd
- **Task management**: Add, edit, and delete tasks
- **Data persistence**: Tasks are saved to `tasks.json` in your home directory
- **Clean UI**: Responsive design with light/dark mode support

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Rust (latest stable version)
- Tauri CLI

### Installation

1. Clone this repository or create a new Tauri project:

```bash
npm create tauri-app@latest kanban-tauri -- --template react-ts
cd kanban-tauri
```

2. Install dependencies:

```bash
npm install
npm install @hello-pangea/dnd react-icons
```

3. Install Rust dependencies:

```bash
cd src-tauri
cargo build
```

### Running the App

To start the development server:

```bash
npm run tauri dev
```

To build for production:

```bash
npm run tauri build
```

## Project Structure

- `src/`: React frontend components
  - `components/KanbanBoard.tsx`: Main Kanban board component
  - `App.tsx`: Main application entry point
  - `App.css`: Global styles
- `src-tauri/`: Rust backend
  - `src/lib.rs`: Tauri commands for file operations
  - `src/main.rs`: Application entry point

## Available Commands

### Frontend Commands

- `load_tasks()`: Load tasks from `tasks.json`
- `save_tasks(data)`: Save tasks to `tasks.json`

### Task Operations

- **Add Task**: Fill out the form at the top and click "Add Task"
- **Edit Task**: Click the edit button on any task card
- **Delete Task**: Click the delete button on any task card
- **Move Task**: Drag and drop tasks between columns

## Data Storage

Tasks are automatically saved to `~/tasks.json` in JSON format:

```json
{
  "columns": [
    {
      "id": "todo",
      "title": "To Do",
      "tasks": [
        {
          "id": "task-1",
          "title": "Example Task",
          "description": "Task description"
        }
      ]
    }
  ]
}
```

## Next Steps for Extension

Here are some ideas to extend this Kanban app:

1. **Task due dates**: Add date pickers and deadline tracking
2. **Task priorities**: Add priority levels (low, medium, high)
3. **Task categories/tags**: Add color-coded tags
4. **User authentication**: Add login functionality
5. **Multiple boards**: Support for multiple Kanban boards
6. **Task comments**: Add discussion threads to tasks
7. **File attachments**: Allow attaching files to tasks
8. **Search functionality**: Search across all tasks
9. **Statistics**: Show productivity metrics
10. **Cloud sync**: Sync tasks across devices

## Technical Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Rust, Tauri
- **UI Library**: @hello-pangea/dnd (drag and drop)
- **Icons**: react-icons
- **Styling**: CSS with dark mode support

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Tauri](https://tauri.app/) - The framework for building desktop apps
- [React](https://react.dev/) - The frontend library
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Drag and drop library
- [react-icons](https://react-icons.github.io/react-icons/) - Icon library

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
