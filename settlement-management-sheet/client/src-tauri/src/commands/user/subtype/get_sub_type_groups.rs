use crate::{
    entities::{
        system_sub_type_group, system_sub_type_group_property, user_sub_type_group,
        user_sub_type_group_property,
    },
    types::{
        GroupId, SystemSubTypeGroup, SystemSubTypePropertyLink, UserSubTypeGroup,
        UserSubTypePropertyLink,
    },
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use std::collections::HashMap;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubTypeGroupInput {
    pub user_id: String,
    pub system: Option<bool>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubTypeGroupOutput {
    pub user_groups: Vec<UserSubTypeGroup>,
    pub system_groups: Vec<SystemSubTypeGroup>,
}

//only get propertyl ink here

#[tauri::command]
pub async fn get_sub_type_groups(
    db: tauri::State<'_, DatabaseConnection>,
    input: GetSubTypeGroupInput,
) -> Result<GetSubTypeGroupOutput, String> {
    let system_input = input.system.unwrap_or(false);
    let mut system_groups = Vec::new();
    if system_input {
        system_groups = get_system_sub_type_groups(db.clone()).await?;
    }

    // Fetch groups
    let group_query = user_sub_type_group::Entity::find()
        .filter(user_sub_type_group::Column::CreatedBy.eq(&input.user_id));

    let groups = group_query
        .order_by_desc(user_sub_type_group::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    if groups.is_empty() {
        let output: GetSubTypeGroupOutput = GetSubTypeGroupOutput {
            user_groups: Vec::new(),
            system_groups,
        };
        return Ok(output);
    }

    let group_ids: Vec<String> = groups.iter().map(|g| g.id.clone()).collect();

    // Fetch junctions
    let junctions = user_sub_type_group_property::Entity::find()
        .filter(user_sub_type_group_property::Column::GroupId.is_in(group_ids))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    if junctions.is_empty() {
        // Groups exist but no properties - return groups with empty vec
        let user_groups = groups
            .into_iter()
            .map(UserSubTypeGroup::try_from)
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string());

        let output: GetSubTypeGroupOutput = GetSubTypeGroupOutput {
            user_groups: user_groups?,
            system_groups,
        };
        return Ok(output);
    }

    let mut junction_map: HashMap<GroupId, Vec<user_sub_type_group_property::Model>> =
        HashMap::new();
    for junction in &junctions {
        junction_map
            .entry(GroupId(junction.group_id.clone()))
            .or_default()
            .push(junction.clone());
    }

    // Build final result
    let user_groups = groups
        .into_iter()
        .map(|group| {
            let group_id = GroupId(group.id.clone());
            // let props = property_map.get(&group_id).cloned().unwrap_or_default();
            let mut domain_group = UserSubTypeGroup::try_from(group)?;
            domain_group.properties = if junction_map
                .get(&group_id)
                .cloned()
                .unwrap_or_default()
                .is_empty()
            {
                Some(Vec::new())
            } else {
                Some(
                    junction_map
                        .get(&group_id)
                        .cloned()
                        .unwrap_or_default()
                        .into_iter()
                        .map(UserSubTypePropertyLink::try_from)
                        .collect::<Result<Vec<_>, _>>()
                        .map_err(|e| e.to_string())?,
                )
            };
            Ok(domain_group)
        })
        .collect::<Result<Vec<_>, String>>()
        .map_err(|e: String| e)?;

    let output: GetSubTypeGroupOutput = GetSubTypeGroupOutput {
        user_groups,
        system_groups,
    };

    Ok(output)
}

pub async fn get_system_sub_type_groups(
    db: tauri::State<'_, DatabaseConnection>,
) -> Result<Vec<SystemSubTypeGroup>, String> {
    let groups = system_sub_type_group::Entity::find()
        .order_by_desc(system_sub_type_group::Column::UpdatedAt)
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let group_ids: Vec<String> = groups.iter().map(|g| g.id.clone()).collect();

    let junctions = system_sub_type_group_property::Entity::find()
        .filter(system_sub_type_group_property::Column::GroupId.is_in(group_ids))
        .all(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    let mut junction_map: HashMap<GroupId, Vec<system_sub_type_group_property::Model>> =
        HashMap::new();
    for junction in &junctions {
        junction_map
            .entry(GroupId(junction.group_id.clone()))
            .or_default()
            .push(junction.clone());
    }

    let result = groups
        .into_iter()
        .map(|group| {
            let group_id = GroupId(group.id.clone());
            // let props = property_map.get(&group_id).cloned().unwrap_or_default();
            let mut domain_group = SystemSubTypeGroup::try_from(group)?;
            domain_group.properties = if junction_map
                .get(&group_id)
                .cloned()
                .unwrap_or_default()
                .is_empty()
            {
                Some(Vec::new())
            } else {
                Some(
                    junction_map
                        .get(&group_id)
                        .cloned()
                        .unwrap_or_default()
                        .into_iter()
                        .map(SystemSubTypePropertyLink::try_from)
                        .collect::<Result<Vec<_>, _>>()
                        .map_err(|e| e.to_string())?,
                )
            };
            Ok(domain_group)
        })
        .collect::<Result<Vec<_>, String>>()
        .map_err(|e: String| e)?;

    Ok(result)
}
