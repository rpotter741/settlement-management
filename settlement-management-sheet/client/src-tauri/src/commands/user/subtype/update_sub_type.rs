use crate::entities::user_sub_type;
use crate::set_if_some;
use crate::types::{SemanticAnchors, UserSubType};
use crate::utility::get_now;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSubTypeInput {
    pub id: String,
    pub name: Option<String>,
    pub anchors: Option<SemanticAnchors>,
    pub context: Option<String>,
}

#[tauri::command]
pub async fn update_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    input: UpdateSubTypeInput,
) -> Result<UserSubType, String> {
    use sea_orm::{ActiveModelTrait, Set};

    let existing = user_sub_type::Entity::find()
        .filter(user_sub_type::Column::Id.eq(input.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "User SubType entry not found".to_string())?;

    let mut active: user_sub_type::ActiveModel = existing.into();
    set_if_some!(active, name, input.name);
    set_if_some!(active, context, input.context);
    if let Some(anchors) = input.anchors {
        active.anchors = Set(serde_json::to_string(&anchors).map_err(|e| e.to_string())?);
    }
    active.updated_at = Set(get_now());

    let updated = active.update(db.inner()).await.map_err(|e| e.to_string())?;

    UserSubType::try_from(updated)
}
