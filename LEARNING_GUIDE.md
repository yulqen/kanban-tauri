# Tauri Kanban Board - Learning Guide

Welcome to the Tauri Kanban Board learning guide! This document explains the architecture and key concepts for beginners learning React, TypeScript, and Rust with Tauri.

## 🎯 Application Overview

This is a **Kanban Board** application built with:
- **Frontend**: React + TypeScript
- **Backend**: Rust
- **Framework**: Tauri (cross-platform desktop app framework)

The application allows you to:
- Create, read, update, and delete tasks
- Drag and drop tasks between columns (To Do, In Progress, Done)
- Persist data to a JSON file
- Run as a native desktop application

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                 Tauri Kanban Board               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┐    ┌─────────────────┐        │
│  │   Frontend  │    │     Backend     │        │
│  │ (React/TS)  │◄──►│    (Rust)      │        │
│  └─────────────┘    └─────────────────┘        │
│          ▲                  ▲                    │
│          │                  │                    │
│  ┌───────┴───────┐  ┌───────┴───────┐          │
│  │  Components  │  │  Tauri Commands│          │
│  │  (JSX/TSX)   │  │  (Rust funcs)  │          │
│  └───────┬───────┘  └───────┬───────┘          │
│          │                  │                    │
│  ┌───────▼───────┐  ┌───────▼───────┐          │
│  │  State Mgmt  │  │  File I/O     │          │
│  │ (useState)   │  │ (JSON files)  │          │
│  └───────────────┘  └───────────────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
kanban-tauri/
├── src/                  # React Frontend
│   ├── components/        # React Components
│   │   └── KanbanBoard.tsx # Main Kanban Component
│   ├── App.tsx            # Root Component
│   ├── main.tsx           # React Entry Point
│   └── App.css            # Global Styles
│
├── src-tauri/             # Rust Backend
│   ├── src/
│   │   ├── lib.rs         # Tauri Commands & Core Logic
│   │   └── main.rs        # Rust Entry Point
│   └── tauri.conf.json    # Tauri Configuration
│
├── package.json           # Frontend Dependencies
└── Cargo.toml             # Rust Dependencies
```

## 🔧 Key Technologies Explained

### Tauri
**Tauri** is a framework for building cross-platform desktop applications using web technologies for the frontend and Rust for the backend.

**Key Benefits:**
- Small binary size (compared to Electron)
- Better performance and security
- Native look and feel
- Access to system APIs via Rust

**How it works:**
1. Frontend (React) runs in a webview
2. Backend (Rust) handles system operations
3. Communication happens via Tauri commands

### React with TypeScript
**React** is a JavaScript library for building user interfaces using components.

**TypeScript** adds static typing to JavaScript, catching errors during development.

**Key Concepts in this app:**
- **Functional Components**: Modern way to write React components
- **Hooks**: `useState`, `useEffect` for state and side effects
- **JSX**: HTML-like syntax in JavaScript
- **TypeScript Interfaces**: Define data shapes for type safety

### Rust Backend
**Rust** is a systems programming language focused on safety and performance.

**Key Concepts in this app:**
- **Structs**: Custom data types (`Task`, `Column`, `KanbanData`)
- **Serde**: Serialization/deserialization library for JSON
- **Result Type**: Rust's error handling mechanism
- **File I/O**: Reading and writing JSON files
- **Tauri Commands**: Functions exposed to the frontend

## 🔄 Frontend-Backend Communication

The application uses **Tauri commands** to communicate between React and Rust:

```
Frontend (React) ────┬────► Backend (Rust)
                     │
                     │ Tauri Command
                     │
                     │ invoke('command_name', {data})
                     │
                     ▼
Backend (Rust) ────┬────► Frontend (React)
                     │
                     │ Return value / Promise
                     │
                     │ .then() / async/await
```

**Example Flow:**
1. React calls `invoke('load_tasks')`
2. Tauri routes to `load_tasks()` function in Rust
3. Rust reads `~/tasks.json` file
4. Rust returns `KanbanData` as JSON
5. React receives the data and updates state

## 📂 Main Files Explained

### Frontend Files

#### `src/main.tsx`
- **Purpose**: Entry point for React application
- **Key Concepts**:
  - `ReactDOM.createRoot()` - React 18+ rendering
  - `React.StrictMode` - Development checks
  - Mounts `App` component to DOM

#### `src/App.tsx`
- **Purpose**: Root component of the application
- **Key Concepts**:
  - Component composition
  - Importing child components
  - Basic JSX structure

#### `src/components/KanbanBoard.tsx`
- **Purpose**: Main Kanban board component
- **Key Concepts**:
  - **State Management**: `useState` for all application state
  - **Side Effects**: `useEffect` for data loading
  - **Tauri Integration**: `invoke()` to call Rust functions
  - **Drag and Drop**: Using `@hello-pangea/dnd` library
  - **CRUD Operations**: Create, Read, Update, Delete tasks
  - **Conditional Rendering**: Show different UI based on state
  - **Event Handling**: Button clicks, form submissions

### Backend Files

#### `src-tauri/src/main.rs`
- **Purpose**: Rust application entry point
- **Key Concepts**:
  - Rust `main()` function
  - Conditional compilation attributes
  - Module organization (calls `lib::run()`)

#### `src-tauri/src/lib.rs`
- **Purpose**: Core Rust logic and Tauri commands
- **Key Concepts**:
  - **Structs**: Data modeling with `Task`, `Column`, `KanbanData`
  - **Serde**: JSON serialization/deserialization
  - **Tauri Commands**: `#[tauri::command]` macro
  - **File I/O**: Reading/writing JSON files
  - **Error Handling**: `Result` type and `?` operator
  - **Path Manipulation**: Finding user's home directory

## 🧩 Key Code Patterns

### React Patterns

#### State Management
```typescript
const [data, setData] = useState<KanbanData>({ columns: [] });
const [loading, setLoading] = useState(true);
```
- `useState` hook for managing component state
- TypeScript generic `<KanbanData>` for type safety
- Returns current state and setter function

#### Side Effects
```typescript
useEffect(() => {
  loadTasks();
}, []); // Empty array = run once on mount
```
- `useEffect` for side effects (data loading, subscriptions)
- Second parameter controls when effect runs
- Empty array `[]` means run once when component mounts

#### Tauri Integration
```typescript
const result: KanbanData = await invoke('load_tasks');
await invoke('save_tasks', { data: updatedData });
```
- `invoke()` calls Rust functions from React
- Returns a Promise (use `await` or `.then()`)
- Automatic JSON serialization/deserialization

### Rust Patterns

#### Struct Definition
```rust
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
}
```
- `#[derive(...)]` adds traits (functionality) to the struct
- `Serialize/Deserialize` for JSON conversion
- `Debug` for printing, `Clone` for copying
- `pub` makes struct and fields public

#### Tauri Command
```rust
#[tauri::command]
fn load_tasks() -> Result<KanbanData, String> {
    // Function implementation
}
```
- `#[tauri::command]` exposes function to frontend
- Returns `Result` type for error handling
- `Ok(data)` on success, `Err(message)` on failure

#### Error Handling
```rust
let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
```
- `map_err()` converts error types
- `?` operator propagates errors (early return)
- Cleaner than nested `match` statements

## 🚀 Running the Application

### Development Mode
```bash
npm run tauri dev
```
- Starts both frontend and backend
- Hot reloading for React code
- Automatic restart for Rust changes

### Production Build
```bash
npm run build
npm run tauri build
```
- Creates optimized production build
- Generates platform-specific binaries
- Output in `src-tauri/target/release/`

## 🎓 Learning Path

### For React/TypeScript Beginners
1. **Start with `App.tsx` and `main.tsx`** - Simple components
2. **Study `KanbanBoard.tsx` state management** - `useState`, `useEffect`
3. **Learn JSX syntax** - How HTML and JavaScript mix
4. **Understand Tauri integration** - `invoke()` calls to Rust
5. **Explore event handling** - Button clicks, form submissions

### For Rust Beginners
1. **Start with `main.rs`** - Simple entry point
2. **Study struct definitions in `lib.rs`** - Data modeling
3. **Learn Tauri commands** - `#[tauri::command]` macro
4. **Understand Result type** - Rust's error handling
5. **Explore file I/O** - Reading and writing JSON

### For Tauri Beginners
1. **Understand the architecture** - Webview + Rust backend
2. **Study command system** - How frontend calls backend
3. **Learn configuration** - `tauri.conf.json` settings
4. **Explore plugins** - Extending functionality
5. **Understand security** - Tauri's safety features

## 🔍 Debugging Tips

### Frontend Debugging
- Use browser dev tools (F12)
- Check console for errors
- Use `console.log()` for debugging
- React DevTools extension for component inspection

### Backend Debugging
- Use `println!()` for simple debugging
- Check terminal output for Rust errors
- Use `cargo check` to verify Rust code
- `RUST_BACKTRACE=1 npm run tauri dev` for stack traces

### Common Issues
1. **Tauri command not found** - Check function name and `#[tauri::command]`
2. **TypeScript errors** - Verify interfaces match Rust structs
3. **File permission issues** - Check home directory access
4. **CORS issues** - Tauri handles this automatically

## 📚 Recommended Resources

### React & TypeScript
- [React Official Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Rust
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings) (small exercises)

### Tauri
- [Tauri Official Documentation](https://tauri.app/v1/guides/)
- [Tauri Examples](https://github.com/tauri-apps/tauri/tree/dev/examples)
- [Tauri Discord Community](https://discord.gg/tauri)

## 🎯 Next Steps for Learning

### Extend This Application
1. **Add task priorities** - Low, Medium, High with colors
2. **Implement due dates** - Add date picker and overdue highlighting
3. **Add user authentication** - Simple login system
4. **Support multiple boards** - Different projects/workspaces
5. **Add search functionality** - Filter tasks by title/description

### Build Your Own Projects
1. **Todo App** - Simple task management
2. **Weather App** - API integration
3. **Chat Application** - WebSocket communication
4. **File Explorer** - System file operations
5. **Game** - Simple 2D game with Tauri

## 💡 Key Takeaways

1. **Tauri bridges web and native** - Use web skills for desktop apps
2. **React + Rust is powerful** - Best of both worlds
3. **Type safety matters** - TypeScript and Rust prevent many bugs
4. **State management is key** - React hooks make it approachable
5. **Error handling is important** - Rust's Result type is excellent
6. **Small, focused components** - Easier to understand and maintain
7. **Progressive learning** - Start simple, add complexity gradually

Happy coding! 🚀