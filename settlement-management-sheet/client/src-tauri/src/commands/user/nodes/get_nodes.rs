use crate::{
    entities::user_glossary_node,
    types::{GlossaryId, UserGlossaryNode},
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[tauri::command]
pub async fn get_nodes(
    db: tauri::State<'_, DatabaseConnection>,
    glossary_id: GlossaryId,
) -> Result<Vec<UserGlossaryNode>, String> {
    let query = user_glossary_node::Entity::find()
        .filter(user_glossary_node::Column::GlossaryId.eq(glossary_id.0))
        .order_by_asc(user_glossary_node::Column::SortIndex)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let result = query
        .into_iter()
        .map(UserGlossaryNode::try_from)
        .collect::<Result<Vec<UserGlossaryNode>, String>>()?;
    Ok(result)
}
