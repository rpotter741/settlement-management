// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sea_orm::{Database, DatabaseConnection};
use std::fs;
use tauri::Manager;

mod commands;
mod entities;
mod entries;
mod logging;
mod macros;
mod types;
mod utility;

// Import from the migration crate, not a local module
use logging::setup_logging;
use migration::{Migrator, MigratorTrait};
use tracing::{error, info, warn};

async fn setup_database(
    app_handle: &tauri::AppHandle,
) -> Result<DatabaseConnection, Box<dyn std::error::Error>> {
    // Get the app's data directory
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    // Create the directory if it doesn't exist
    fs::create_dir_all(&app_data_dir)?;

    // Build the database path
    let db_path = app_data_dir.join("app.db");
    let database_url = format!("sqlite://{}?mode=rwc", db_path.display());

    println!("Connecting to database at: {}", database_url);

    // Connect to database
    let db = Database::connect(&database_url).await?;

    // Run migrations
    println!("Running migrations...");
    Migrator::up(&db, None).await?;
    println!("Migrations complete");

    Ok(db)
}

// nuke app in dev via:
// rm ~/Library/Application\ Support/com.robbiepotts.eclorean-ledger/app.db

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Get log directory
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            let log_dir = app_data_dir.join("logs");

            // Initialize logging
            setup_logging(log_dir.clone()).expect("Failed to setup logging");

            info!("Application started");
            info!("Log directory: {:?}", log_dir);

            // Spawn database setup on tokio runtime (non-blocking)
            tauri::async_runtime::spawn(async move {
                match setup_database(&app_handle).await {
                    Ok(db) => {
                        app_handle.manage(db);
                        println!("Database initialized successfully");
                    }
                    Err(e) => {
                        eprintln!("Failed to initialize database: {}", e);
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::glossary::get_glossaries,
            commands::glossary::create_glossary,
            commands::glossary::get_glossary_by_id,
            commands::glossary::delete_glossary,
            commands::glossary::update_glossary,
            commands::nodes::get_nodes,
            commands::nodes::create_node_and_entry,
            commands::nodes::delete_node_and_entry,
            commands::nodes::rename_node_and_entry,
            commands::nodes::update_node_parent_id,
            commands::nodes::update_node_sort_indices,
            commands::entry::get_entry_by_id,
            commands::entry::get_entries_by_id,
            commands::entry::update_entry_groups,
            commands::entry::update_entry_sub_type,
            commands::entry::search_entries,
            commands::subtype::get_sub_type_properties,
            commands::subtype::create_sub_type_property,
            commands::subtype::create_sub_type_group,
            commands::subtype::get_sub_type_groups,
            commands::subtype::create_sub_type,
            commands::subtype::get_sub_types,
            commands::subtype::create_group_property,
            commands::subtype::add_group_to_subtype,
            commands::subtype::delete_sub_type,
            commands::subtype::delete_sub_type_property,
            commands::subtype::delete_sub_type_group,
            commands::subtype::remove_group_property,
            commands::subtype::reorder_group_properties,
            commands::subtype::update_sub_type_group,
            commands::subtype::update_sub_type_property,
            commands::subtype::remove_group_from_sub_type,
            commands::subtype::update_sub_type,
            commands::backlinks::update_backlink,
            commands::logging::get_log_path,
            commands::logging::get_recent_logs,
            commands::logging::log_frontend_error,
            commands::app::init_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    app_lib::run();
}
