use crate::{
    entities::system_sub_type_property,
    types::{PropertyId, PropertyShape, SystemSubTypeProperty},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};
use tracing::error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSubTypePropertyInput {
    pub id: PropertyId,
    pub name: String,
    pub input_type: String, // to bypass weird enum serialization (since tags need per-enum attributes)
    pub shape: String,      // see above comment
}

#[cfg(debug_assertions)]
#[tauri::command]
pub async fn sys_create_sub_type_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateSubTypePropertyInput,
) -> Result<SystemSubTypeProperty, String> {
    // validate! good for security, and the workaround for enum serialization
    let _validated_shape = PropertyShape::from_json_and_type(&input.shape, &input.input_type)?;

    let new_sub_type_property = system_sub_type_property::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        input_type: Set(input.input_type),
        shape: Set(input.shape),
        ..Default::default()
    };

    let new_property = new_sub_type_property.insert(db.inner()).await;

    match new_property {
        Ok(property) => Ok(SystemSubTypeProperty::try_from(property)?),
        Err(e) => {
            error!("Failed to create SubTypeProperty: {}", e);
            Err(format!("Failed to create SubTypeProperty: {}", e))
        }
    }
}
