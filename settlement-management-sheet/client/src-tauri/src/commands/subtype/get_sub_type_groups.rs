use crate::{
    entities::{sub_type_group, sub_type_group_property, sub_type_property},
    types::{GroupId, PropertyId, SubTypeGroup, SubTypeProperty},
};
use sea_orm::{ColumnTrait, Condition, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use std::collections::HashMap;

#[derive(serde::Deserialize)]
pub struct GetSubTypeGroupInput {
    pub user_id: String,
    pub system: Option<bool>,
}

#[tauri::command]
pub async fn get_sub_type_groups(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypeGroupInput,
) -> Result<Vec<(SubTypeGroup, Vec<SubTypeProperty>)>, String> {
    let system_input = input.system.unwrap_or(false);

    // Fetch groups
    let mut group_query = sub_type_group::Entity::find();
    if system_input {
        group_query = group_query.filter(
            Condition::any()
                .add(sub_type_group::Column::CreatedBy.eq(&input.user_id))
                .add(sub_type_group::Column::ContentType.eq("system")),
        );
    } else {
        group_query = group_query.filter(sub_type_group::Column::CreatedBy.eq(&input.user_id));
    }

    let groups = group_query
        .order_by_desc(sub_type_group::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    if groups.is_empty() {
        return Ok(Vec::new()); // Early return optimization
    }

    let group_ids: Vec<String> = groups.iter().map(|g| g.id.clone()).collect();

    // Fetch junctions
    let junctions = sub_type_group_property::Entity::find()
        .filter(sub_type_group_property::Column::GroupId.is_in(group_ids))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    if junctions.is_empty() {
        // Groups exist but no properties - return groups with empty vec
        return groups
            .into_iter()
            .map(|g| SubTypeGroup::try_from(g).map(|g| (g, Vec::new())))
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string());
    }

    let property_ids: Vec<String> = junctions.iter().map(|j| j.property_id.clone()).collect();

    // Fetch properties
    let properties = sub_type_property::Entity::find()
        .filter(sub_type_property::Column::Id.is_in(property_ids))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    // Convert to domain models
    let domain_properties: Vec<SubTypeProperty> = properties
        .into_iter()
        .map(SubTypeProperty::try_from)
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    // Build lookup map
    let property_lookup: HashMap<PropertyId, SubTypeProperty> = domain_properties
        .into_iter()
        .map(|p| (p.id.clone(), p))
        .collect();

    // Map properties to groups
    let mut property_map: HashMap<GroupId, Vec<SubTypeProperty>> = HashMap::new();
    for junction in junctions {
        if let Some(prop) = property_lookup.get(&PropertyId(junction.property_id)) {
            property_map
                .entry(GroupId(junction.group_id))
                .or_default()
                .push(prop.clone());
        }
    }

    // Build final result
    groups
        .into_iter()
        .map(|group| {
            let group_id = GroupId(group.id.clone());
            let props = property_map.get(&group_id).cloned().unwrap_or_default();
            SubTypeGroup::try_from(group).map(|g| (g, props))
        })
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())
}
