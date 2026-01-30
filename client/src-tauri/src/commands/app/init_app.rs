use crate::entities::users;
use chrono::Utc;
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, Set, TransactionTrait};
use serde::Serialize;
use ulid::Ulid;

#[tauri::command]
pub async fn init_app(db: tauri::State<'_, DatabaseConnection>) -> Result<AppInitData, String> {
    // Get the first (and only) user
    let user = users::Entity::find()
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let user = match user {
        Some(u) => u,
        None => {
            // No user exists, create one
            let new_user = users::ActiveModel {
                id: Set(Ulid::new().to_string()),
                role: Set("user".to_string()),
                username: Set("local_user".to_string()),
                email: Set("user@localhost".to_string()),
                created_at: Set(Utc::now().to_rfc3339()),
                updated_at: Set(Utc::now().to_rfc3339()),
            };

            new_user
                .insert(db.inner())
                .await
                .map_err(|e| e.to_string())?
        }
    };

    Ok(AppInitData {
        user_id: user.id,
        username: user.username,
        email: user.email,
    })
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInitData {
    user_id: String,
    username: String,
    email: String,
}
