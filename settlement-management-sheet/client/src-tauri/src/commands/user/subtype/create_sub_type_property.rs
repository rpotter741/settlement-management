use crate::{
    entities::user_sub_type_property,
    types::{PropertyId, PropertyShape, UserSubTypeProperty},
};
use sea_orm::{ActiveModelTrait, DatabaseConnection, Set};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateSubTypePropertyInput {
    pub id: PropertyId,
    pub name: String,
    pub content_type: String,
    pub created_by: String,
    pub input_type: String, // to bypass weird enum serialization (since tags need per-enum attributes)
    pub shape: String,      // see above comment
}

#[tauri::command]
pub async fn create_sub_type_property(
    db: tauri::State<'_, DatabaseConnection>,
    input: CreateSubTypePropertyInput,
) -> Result<UserSubTypeProperty, String> {
    // validate! good for security, and the workaround for enum serialization
    let _validated_shape = PropertyShape::from_json_and_type(&input.shape, &input.input_type)?;

    let new_sub_type_property = user_sub_type_property::ActiveModel {
        id: Set(input.id.0),
        name: Set(input.name),
        created_by: Set(input.created_by),
        input_type: Set(input.input_type),
        shape: Set(input.shape),
        ..Default::default()
    };

    let new_property = new_sub_type_property
        .insert(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(UserSubTypeProperty::try_from(new_property)?)
}
