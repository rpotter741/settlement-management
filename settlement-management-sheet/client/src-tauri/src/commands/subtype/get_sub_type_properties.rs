use crate::{entities::sub_type_property, types::SubTypeProperty};
use sea_orm::{ColumnTrait, Condition, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[derive(serde::Deserialize)]
pub struct GetSubTypePropertiesInput {
    user_id: String,
    system: Option<bool>,
}

#[tauri::command]
pub async fn get_sub_type_properties(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypePropertiesInput,
) -> Result<Vec<SubTypeProperty>, String> {
    let system_input = input.system.unwrap_or(false);

    // build query
    let mut query = sub_type_property::Entity::find();

    if system_input {
        query = query.filter(
            Condition::any()
                .add(sub_type_property::Column::CreatedBy.eq(input.user_id))
                .add(sub_type_property::Column::ContentType.eq(true)),
        )
    } else {
        query = query.filter(sub_type_property::Column::CreatedBy.eq(input.user_id));
    }

    // execute query
    let properties = query
        .order_by_desc(sub_type_property::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    // convert to SubTypeProperty
    let result = properties
        .into_iter()
        .map(SubTypeProperty::try_from)
        .collect::<Result<Vec<SubTypeProperty>, _>>()
        .map_err(|e| e.to_string())?;

    // return result

    Ok(result)
}
