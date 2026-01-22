use crate::{entities::entry_sub_type, types::SubType};
use sea_orm::{ColumnTrait, Condition, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[derive(serde::Deserialize)]
pub struct GetSubTypesInput {
    user_id: String,
    system: Option<bool>,
}

#[tauri::command]
pub async fn get_sub_types(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypesInput,
) -> Result<Vec<SubType>, String> {
    let system_input = input.system.unwrap_or(false);
    let mut query = entry_sub_type::Entity::find();

    if system_input {
        query = query.filter(
            Condition::any()
                .add(entry_sub_type::Column::CreatedBy.eq(input.user_id))
                .add(entry_sub_type::Column::ContentType.eq(true)),
        )
    } else {
        query = query.filter(entry_sub_type::Column::CreatedBy.eq(input.user_id));
    }

    let result = query
        .order_by_desc(entry_sub_type::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(result
        .into_iter()
        .map(SubType::try_from)
        .collect::<Result<Vec<SubType>, String>>()?)
}
