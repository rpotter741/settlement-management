// commands/system/mod.rs

// Method 1: On the module export
// #[cfg(any(debug_assertions, feature = "admin"))]
// pub mod system_glossary;

// #[cfg(any(debug_assertions, feature = "admin"))]
// pub mod system_subtypes;

// Method 2: On each command (more granular)
// #[tauri::command]
// #[cfg(any(debug_assertions, feature = "admin"))]
// pub async fn create_system_glossary(...) -> Result<SystemGlossary, String> {
// Only available in dev OR admin builds
// }
