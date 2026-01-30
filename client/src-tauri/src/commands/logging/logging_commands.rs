use std::fs;
use tauri::Manager;

#[tauri::command]
pub async fn get_log_path(app_handle: tauri::AppHandle) -> Result<String, String> {
    let log_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("logs");

    Ok(log_dir.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn _open_log_folder(app_handle: tauri::AppHandle) -> Result<(), String> {
    let _log_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("logs");

    // open(&app_handle, log_dir.to_str().unwrap(), None).map_err(|e: tauri::Error| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn get_recent_logs(
    app_handle: tauri::AppHandle,
    lines: usize,
) -> Result<Vec<String>, String> {
    let log_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("logs");

    let log_file = log_dir.join("app.log");

    let contents = fs::read_to_string(log_file).map_err(|e| e.to_string())?;

    let recent: Vec<String> = contents
        .lines()
        .rev()
        .take(lines)
        .map(String::from)
        .collect::<Vec<_>>()
        .into_iter()
        .rev()
        .collect();

    Ok(recent)
}

#[tauri::command]
pub async fn log_frontend_error(
    level: String,
    message: String,
    context: Option<String>,
) -> Result<(), String> {
    use tracing::{error, info, warn};

    let ctx = context.unwrap_or_default();

    match level.as_str() {
        "info" => info!("[FRONTEND] {} | {}", message, ctx),
        "warn" => warn!("[FRONTEND] {} | {}", message, ctx),
        "error" => error!("[FRONTEND] {} | {}", message, ctx),
        _ => info!("[FRONTEND] {} | {}", message, ctx),
    }

    Ok(())
}
