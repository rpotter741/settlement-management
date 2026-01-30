use crate::entities::user_sub_type_property;
use crate::types::UserSubTypeProperty;
use crate::utility::get_now;
use crate::{set_if_some, some_set_if_some};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSubTypePropertyInput {
    pub id: String,
    pub name: Option<String>,
    pub input_type: Option<String>,
    pub shape: Option<String>,
    pub display_name: Option<String>,
    pub smart_sync: Option<String>,
}

#[tauri::command]
pub async fn update_sub_type_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypePropertyInput,
) -> Result<UserSubTypeProperty, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = user_sub_type_property::Entity::find()
        .filter(user_sub_type_property::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "SubTypeProperty entry not found".to_string())?;
    let mut active: user_sub_type_property::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, input_type, input.input_type);
    set_if_some!(active, shape, input.shape);
    some_set_if_some!(active, display_name, input.display_name);
    some_set_if_some!(active, smart_sync, input.smart_sync);
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    UserSubTypeProperty::try_from(updated)
}
