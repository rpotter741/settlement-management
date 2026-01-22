use crate::{entities::glossary, types::Glossary};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[tauri::command]
pub async fn get_glossaries(
    db: tauri::State<'_, DatabaseConnection>,
    user_id: String,
) -> Result<Vec<Glossary>, String> {
    glossary::Entity::find()
        .filter(glossary::Column::CreatedBy.eq(user_id))
        .order_by_desc(glossary::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())
        .and_then(|glossaries| {
            glossaries
                .into_iter()
                .map(Glossary::try_from)
                .collect::<Result<Vec<_>, _>>()
        })
}
