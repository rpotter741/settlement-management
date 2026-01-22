use crate::entities::sub_type_property;
use crate::types::{get_now, SmartLinkRulesShape, SubTypeProperty};
use crate::{set_if_some, some_set_if_some, some_set_json_if_some};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
pub struct UpdateSubTypePropertyInput {
    pub id: String,
    pub ref_id: Option<String>,
    pub version: Option<i32>,
    pub name: Option<String>,
    pub input_type: Option<String>,
    pub shape: Option<String>,
    pub display_name: Option<String>,
    pub smart_sync: Option<SmartLinkRulesShape>,
}

#[tauri::command]
pub async fn update_sub_type_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypePropertyInput,
) -> Result<SubTypeProperty, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = sub_type_property::Entity::find()
        .filter(sub_type_property::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "SubTypeProperty entry not found".to_string())?;
    let mut active: sub_type_property::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, input_type, input.input_type);
    set_if_some!(active, shape, input.shape);
    set_if_some!(active, ref_id, input.ref_id);
    set_if_some!(active, version, input.version);
    some_set_if_some!(active, display_name, input.display_name);
    some_set_json_if_some!(active, smart_sync, input.smart_sync);
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    SubTypeProperty::try_from(updated)
}
