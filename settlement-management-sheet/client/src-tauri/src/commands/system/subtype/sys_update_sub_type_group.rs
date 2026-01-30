use std::collections::HashMap;

use crate::entities::system_sub_type_group;
use crate::types::{DisplayColumn, PropertyId, SystemSubTypeGroup};
use crate::utility::get_now;
use crate::{set_if_some, some_set_if_some, some_set_json_if_some};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSubTypeGroupInput {
    pub id: String,
    pub name: Option<String>,
    pub display_name: Option<String>,
    pub display: Option<HashMap<PropertyId, DisplayColumn>>,
    pub description: Option<String>,
}

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_update_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypeGroupInput,
) -> Result<SystemSubTypeGroup, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = system_sub_type_group::Entity::find()
        .filter(system_sub_type_group::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "SubTypeGroup entry not found".to_string())?;

    let mut active: system_sub_type_group::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    some_set_if_some!(active, description, input.description);
    some_set_if_some!(active, display_name, input.display_name);
    some_set_json_if_some!(active, display, input.display);
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    SystemSubTypeGroup::try_from(updated)
}
