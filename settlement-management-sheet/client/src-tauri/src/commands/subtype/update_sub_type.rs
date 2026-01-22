use crate::entities::entry_sub_type;
use crate::types::{get_now, SemanticAnchors, SubType};
use crate::{set_if_some, some_set_if_some};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
pub struct UpdateSubTypeInput {
    pub id: String,
    pub name: Option<String>,
    pub ref_id: Option<String>,
    pub version: Option<i32>,
    pub editors: Option<Vec<String>>,
    pub anchors: Option<SemanticAnchors>,
    pub context: Option<String>,
}

#[tauri::command]
pub async fn update_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypeInput,
) -> Result<SubType, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = entry_sub_type::Entity::find()
        .filter(entry_sub_type::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "EntrySubType entry not found".to_string())?;

    let mut active: entry_sub_type::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, ref_id, input.ref_id);
    set_if_some!(active, version, input.version);
    some_set_if_some!(active, context, input.context);
    if let Some(editors) = input.editors {
        active.editors = Set(Some(editors.join(",")));
    }
    if let Some(anchors) = input.anchors {
        active.anchors = Set(Some(
            serde_json::to_string(&anchors).map_err(|e| e.to_string())?,
        ));
    }
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    SubType::try_from(updated)
}
