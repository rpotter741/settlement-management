use crate::{entities::glossary, types::Glossary};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn get_glossary_by_id(
    db: tauri::State<'_, DatabaseConnection>,
    id: String,
) -> Result<Glossary, String> {
    let model = glossary::Entity::find()
        .filter(glossary::Column::Id.eq(id))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(Glossary::try_from(
        model
            .into_iter()
            .next()
            .ok_or_else(|| "Glossary not found".to_string())?,
    )?)
}
