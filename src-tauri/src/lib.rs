// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Column {
    pub id: String,
    pub title: String,
    pub tasks: Vec<Task>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KanbanData {
    pub columns: Vec<Column>,
}

fn get_tasks_path() -> PathBuf {
    dirs::home_dir().expect("Failed to get home directory").join("tasks.json")
}

#[tauri::command]
fn load_tasks() -> Result<KanbanData, String> {
    let path = get_tasks_path();
    
    if !path.exists() {
        // Return default columns if file doesn't exist
        let default_data = KanbanData {
            columns: vec![
                Column {
                    id: "todo".to_string(),
                    title: "To Do".to_string(),
                    tasks: vec![
                        Task {
                            id: "task-1".to_string(),
                            title: "Learn Tauri".to_string(),
                            description: "Learn how to build apps with Tauri".to_string(),
                        },
                        Task {
                            id: "task-2".to_string(),
                            title: "Build Kanban App".to_string(),
                            description: "Create a Kanban board application".to_string(),
                        },
                    ],
                },
                Column {
                    id: "in-progress".to_string(),
                    title: "In Progress".to_string(),
                    tasks: vec![
                        Task {
                            id: "task-3".to_string(),
                            title: "Implement Drag and Drop".to_string(),
                            description: "Add drag and drop functionality".to_string(),
                        },
                    ],
                },
                Column {
                    id: "done".to_string(),
                    title: "Done".to_string(),
                    tasks: vec![
                        Task {
                            id: "task-4".to_string(),
                            title: "Set up Project".to_string(),
                            description: "Initialize Tauri project with React".to_string(),
                        },
                    ],
                },
            ],
        };
        
        save_tasks(default_data.clone())?;
        return Ok(default_data);
    }
    
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_tasks(data: KanbanData) -> Result<(), String> {
    let path = get_tasks_path();
    let content = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_tasks, save_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
