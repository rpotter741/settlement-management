use crate::{entities::glossary_node, types::GlossaryNode};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

#[tauri::command]
pub async fn get_nodes(
    db: tauri::State<'_, DatabaseConnection>,
    glossary_id: String,
) -> Result<Vec<GlossaryNode>, String> {
    let query = glossary_node::Entity::find()
        .filter(glossary_node::Column::GlossaryId.eq(glossary_id))
        .order_by_asc(glossary_node::Column::SortIndex)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let result = query
        .into_iter()
        .map(GlossaryNode::try_from)
        .collect::<Result<Vec<GlossaryNode>, String>>()?;

    Ok(result)
}
