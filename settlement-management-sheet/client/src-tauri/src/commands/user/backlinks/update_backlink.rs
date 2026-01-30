use crate::types::UserBacklinkIndex;
use crate::{entities::user_backlink_index, utility::get_now};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

#[derive(serde::Deserialize)]
pub struct UpdateBacklinkInput {
    pub id: String,
    pub ignore_divergence: Option<bool>,
    pub property_value: Option<serde_json::Value>,
    pub target_ignore: Option<bool>,
}

#[tauri::command]
pub async fn update_backlink(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateBacklinkInput,
) -> Result<UserBacklinkIndex, String> {
    let existing = user_backlink_index::Entity::find()
        .filter(user_backlink_index::Column::Id.eq(&input.id))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "BacklinkIndex entry not found".to_string())?;

    let mut active: user_backlink_index::ActiveModel = existing.into();

    // Only update fields that were provided
    if let Some(ignore_divergence) = input.ignore_divergence {
        active.ignore_divergence = Set(if ignore_divergence { 1 } else { 0 });
    }

    if let Some(property_value) = input.property_value {
        active.property_value = Set(Some(property_value.to_string()));
    }

    if let Some(target_ignore) = input.target_ignore {
        active.target_ignore = Set(if target_ignore { 1 } else { 0 });
    }

    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    UserBacklinkIndex::try_from(updated)
}
