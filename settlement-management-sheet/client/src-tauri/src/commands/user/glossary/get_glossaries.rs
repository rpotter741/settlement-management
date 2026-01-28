use crate::{entities::user_glossary, types::UserGlossary};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[tauri::command]
pub async fn get_glossaries(
    db: tauri::State<'_, DatabaseConnection>,
    user_id: String,
) -> Result<Vec<UserGlossary>, String> {
    user_glossary::Entity::find()
        .filter(user_glossary::Column::CreatedBy.eq(user_id))
        .order_by_desc(user_glossary::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())
        .and_then(|glossaries| {
            glossaries
                .into_iter()
                .map(UserGlossary::try_from)
                .collect::<Result<Vec<_>, _>>()
        })
}
