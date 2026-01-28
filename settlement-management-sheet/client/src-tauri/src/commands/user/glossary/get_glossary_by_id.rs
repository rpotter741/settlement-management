use crate::{entities::user_glossary, types::UserGlossary};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[tauri::command]
pub async fn get_glossary_by_id(
    db: tauri::State<'_, DatabaseConnection>,
    id: String,
) -> Result<UserGlossary, String> {
    let model = user_glossary::Entity::find()
        .filter(user_glossary::Column::Id.eq(id))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(UserGlossary::try_from(
        model
            .into_iter()
            .next()
            .ok_or_else(|| "Glossary not found".to_string())?,
    )?)
}
