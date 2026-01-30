use crate::entities::system_sub_type;
use crate::set_if_some;
use crate::types::{SemanticAnchors, SystemSubType};
use crate::utility::get_now;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSubTypeInput {
    pub id: String,
    pub name: Option<String>,
    pub anchors: Option<SemanticAnchors>,
}

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_update_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypeInput,
) -> Result<SystemSubType, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = system_sub_type::Entity::find()
        .filter(system_sub_type::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "System SubType entry not found".to_string())?;

    let mut active: system_sub_type::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    if let Some(anchors) = input.anchors {
        active.anchors = Set(serde_json::to_string(&anchors).map_err(|e| e.to_string())?);
    }
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    SystemSubType::try_from(updated)
}
