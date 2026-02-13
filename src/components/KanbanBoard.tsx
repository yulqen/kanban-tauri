import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { invoke } from '@tauri-apps/api/core';
import { FiPlus, FiEdit, FiTrash2, FiSave } from 'react-icons/fi';

type Task = {
  id: string;
  title: string;
  description: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type KanbanData = {
  columns: Column[];
};

export const KanbanBoard: React.FC = () => {
  const [data, setData] = useState<KanbanData>({ columns: [] });
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<{ columnId: string; taskId: string } | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskColumn, setNewTaskColumn] = useState('todo');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result: KanbanData = await invoke('load_tasks');
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setLoading(false);
    }
  };

  const saveTasks = async (updatedData: KanbanData) => {
    try {
      await invoke('save_tasks', { data: updatedData });
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    const newData = { ...data };
    const sourceColumn = newData.columns.find(col => col.id === source.droppableId);
    const destColumn = newData.columns.find(col => col.id === destination.droppableId);

    if (sourceColumn && destColumn) {
      // Remove from source column
      const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
      
      // Add to destination column
      destColumn.tasks.splice(destination.index, 0, movedTask);
      
      setData(newData);
      saveTasks(newData);
    }
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription,
    };

    const newData = { ...data };
    const column = newData.columns.find(col => col.id === newTaskColumn);
    if (column) {
      column.tasks.push(newTask);
      setData(newData);
      saveTasks(newData);
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const newData = { ...data };
    const column = newData.columns.find(col => col.id === columnId);
    if (column) {
      column.tasks = column.tasks.filter(task => task.id !== taskId);
      setData(newData);
      saveTasks(newData);
    }
  };

  const startEditing = (columnId: string, taskId: string) => {
    const column = data.columns.find(col => col.id === columnId);
    const task = column?.tasks.find(task => task.id === taskId);
    
    if (task) {
      setEditingTask({ columnId, taskId });
      setEditTitle(task.title);
      setEditDescription(task.description);
    }
  };

  const saveEdit = () => {
    if (!editingTask) return;

    const newData = { ...data };
    const column = newData.columns.find(col => col.id === editingTask.columnId);
    const task = column?.tasks.find(task => task.id === editingTask.taskId);
    
    if (task) {
      task.title = editTitle;
      task.description = editDescription;
      setData(newData);
      saveTasks(newData);
      setEditingTask(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="kanban-board">
      <h1 className="app-title">Tauri Kanban Board</h1>
      
      <div className="add-task-form">
        <h3>Add New Task</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Task description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <div className="column-selector">
            <label>Column:</label>
            <select
              value={newTaskColumn}
              onChange={(e) => setNewTaskColumn(e.target.value)}
            >
              {data.columns.map((column) => (
                <option key={column.id} value={column.id}>{column.title}</option>
              ))}
            </select>
          </div>
          <button onClick={addTask} className="add-button">
            <FiPlus /> Add Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {data.columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="column-title">{column.title}</h2>
                  <div className="tasks-container">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {editingTask?.columnId === column.id && editingTask.taskId === task.id ? (
                              <div className="task-edit-form">
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="edit-title"
                                />
                                <textarea
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="edit-description"
                                />
                                <button onClick={saveEdit} className="save-button">
                                  <FiSave /> Save
                                </button>
                              </div>
                            ) : (
                              <>
                                <h3 className="task-title">{task.title}</h3>
                                <p className="task-description">{task.description}</p>
                                <div className="task-actions">
                                  <button
                                    onClick={() => startEditing(column.id, task.id)}
                                    className="edit-button"
                                  >
                                    <FiEdit />
                                  </button>
                                  <button
                                    onClick={() => deleteTask(column.id, task.id)}
                                    className="delete-button"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
