use std::collections::HashMap;

use crate::entities::sub_type_group;
use crate::types::{get_now, DisplayColumn, PropertyId, SubTypeGroup};
use crate::{set_if_some, some_set_if_some, some_set_json_if_some};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
pub struct UpdateSubTypeGroupInput {
    pub id: String,
    pub name: Option<String>,
    pub ref_id: Option<String>,
    pub version: Option<i32>,
    pub display_name: Option<String>,
    pub display: Option<HashMap<PropertyId, DisplayColumn>>, // damn that's some lazy shit
    pub description: Option<String>,
}

#[tauri::command]
pub async fn update_sub_type_group(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypeGroupInput,
) -> Result<SubTypeGroup, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = sub_type_group::Entity::find()
        .filter(sub_type_group::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "SubTypeGroup entry not found".to_string())?;

    let mut active: sub_type_group::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, description, input.description);
    set_if_some!(active, ref_id, input.ref_id);
    set_if_some!(active, version, input.version);
    some_set_if_some!(active, display_name, input.display_name);
    some_set_json_if_some!(active, display, input.display);
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    SubTypeGroup::try_from(updated)
}
