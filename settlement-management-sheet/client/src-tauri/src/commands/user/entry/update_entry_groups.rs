use crate::entries::generate_form_source::BasicGroup;
use crate::types::*;
use crate::{
    entities::{
        user_backlink_index, user_glossary_entry, user_sub_type, user_sub_type_group,
        user_sub_type_property,
    },
    entries::generate_form_source::ConfigOption,
};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set, TransactionTrait};
use serde_json::Value;
use std::collections::HashMap;

#[tauri::command]
pub async fn update_entry_groups(
    db: tauri::State<'_, DatabaseConnection>,
    entry: UserGlossaryEntry,
) -> Result<UserGlossaryEntry, String> {
    /*---------------------------------------------------------------------- */
    /*-----------------Getting sub type, groups, and properties ------------ */
    /*---------------------------------------------------------------------- */
    let _existing_subtype = user_sub_type::Entity::find()
        .filter(user_sub_type::Column::Id.eq(entry.sub_type_id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Entry sub type not found".to_string())?;

    let _groups_and_properties = _existing_subtype
        .get_groups_and_properties(db.inner())
        .await
        .map_err(|e| e.to_string())?;

    /*---------------------------------------------------------------------- */
    /*----------------------Processing existing entry ---------------------- */
    /*---------------------------------------------------------------------- */

    let _existing_entry = user_glossary_entry::Entity::find()
        .filter(user_glossary_entry::Column::Id.eq(entry.id.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Glossary entry not found".to_string())?;

    let _entry_groups: HashMap<String, BasicGroup> = entry.groups.clone();

    let new_ids = extract_relationship_ids(&_entry_groups, &_groups_and_properties)?;

    /*---------------------------------------------------------------------- */
    /*-------------------------Processing new entry ------------------------ */
    /*---------------------------------------------------------------------- */

    let _existing_entry_groups: HashMap<String, BasicGroup> =
        serde_json::from_value(serde_json::Value::from(_existing_entry.groups.clone()))
            .map_err(|e| e.to_string())?;

    let old_ids = extract_relationship_ids(&_existing_entry_groups, &_groups_and_properties)?;

    /*---------------------------------------------------------------------- */
    /*-------------------------Diff for add / remove------------------------ */
    /*---------------------------------------------------------------------- */

    let added_ids: Vec<_> = new_ids
        .iter()
        .filter(|backlink| !old_ids.iter().any(|link| link == *backlink))
        .cloned()
        .collect();

    let removed_ids: Vec<_> = old_ids
        .iter()
        .filter(|backlink| !new_ids.iter().any(|link| link == *backlink))
        .cloned()
        .collect();

    /*---------------------------------------------------------------------- */
    /*---------------Apply backlink changes + update entry ----------------- */
    /*---------------------------------------------------------------------- */

    let txn = db.begin().await.map_err(|e| e.to_string())?;

    for added in added_ids {
        let active_model = user_backlink_index::ActiveModel {
            id: Set(added.id),
            property_name: Set(added.property_name),
            property_value: Set(added.property_value),
            property_id: Set(added.property_id),
            r#type: Set(Some(added.link_type)),
            sub_property_id: Set(added.sub_property_id.clone()),
            ..Default::default()
        };
        user_backlink_index::Entity::insert(active_model)
            .exec(&txn)
            .await
            .map_err(|e| e.to_string())?;
    }

    for removed in removed_ids {
        user_backlink_index::Entity::delete_many()
            .filter(user_backlink_index::Column::Id.eq(removed.id))
            .exec(&txn)
            .await
            .map_err(|e| e.to_string())?;
    }

    let mut active_entry: user_glossary_entry::ActiveModel = _existing_entry.into();
    active_entry.groups = Set(Some(
        serde_json::to_string(&entry.groups).map_err(|e| e.to_string())?,
    ));

    let updated_entry = user_glossary_entry::Entity::update(active_entry)
        .exec(&txn)
        .await
        .map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(UserGlossaryEntry::try_from(updated_entry)?)
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct BacklinkShape {
    pub id: String,
    pub property_name: String,
    pub property_value: Option<String>,
    pub property_id: String,
    pub link_type: String,
    pub sub_property_id: Option<String>,
}

pub fn extract_relationship_ids(
    entry_groups: &HashMap<String, BasicGroup>,
    groups_and_properties: &(
        Vec<user_sub_type_group::Model>,
        Vec<user_sub_type_property::Model>,
    ),
) -> Result<Vec<BacklinkShape>, String> {
    let mut relationship_ids: Vec<BacklinkShape> = Vec::new();

    for (_group_id, group) in entry_groups.iter() {
        for (property_id, property) in group.properties.iter() {
            // Find property definition once
            let prop_def = groups_and_properties
                .1
                .iter()
                .find(|p| p.id == *property_id)
                .ok_or("Property definition not found")?;

            // Parse shape once
            let shape = prop_def.parsed_shape().map_err(|e| e.to_string())?;

            // Check if it's a dropdown with relationships
            let _dropdown_shape = match &shape {
                PropertyShape::Dropdown(ds) if ds.relationship.is_some() => ds,
                _ => continue, // Skip non-relationship properties
            };

            match property {
                ConfigOption::Single(config) => {
                    extract_ids_from_value(
                        &config.value,
                        &prop_def.name,
                        &prop_def.id,
                        "direct",
                        None,
                        &mut relationship_ids,
                    )?;
                }
                ConfigOption::Compound(compound_config) => {
                    for (_id, compound_value) in compound_config.value.iter() {
                        for (_side, config) in [
                            ("left", &compound_value.left),
                            ("right", &compound_value.right),
                        ] {
                            extract_ids_from_value(
                                &config.value,
                                &prop_def.name,
                                &prop_def.id,
                                "compound",
                                Some(&_id),
                                &mut relationship_ids,
                            )?;
                        }
                    }
                }
            }
        }
    }

    Ok(relationship_ids)
}

// Helper to reduce duplication
fn extract_ids_from_value(
    value: &Value,
    prop_name: &str,
    prop_id: &str,
    link_type: &str,
    sub_property_id: Option<&str>,
    results: &mut Vec<BacklinkShape>,
) -> Result<(), String> {
    match value {
        Value::Array(arr) => {
            for val in arr {
                if let Some(id_str) = val.as_str() {
                    results.push(BacklinkShape {
                        id: id_str.to_string(),
                        property_name: prop_name.to_string(),
                        property_value: None,
                        property_id: prop_id.to_string(),
                        link_type: link_type.to_string(),
                        sub_property_id: sub_property_id.map(|s| s.to_string()),
                    });
                }
            }
        }
        Value::String(s) => {
            results.push(BacklinkShape {
                id: s.clone(),
                property_name: prop_name.to_string(),
                property_value: None,
                property_id: prop_id.to_string(),
                link_type: link_type.to_string(),
                sub_property_id: sub_property_id.map(|s| s.to_string()),
            });
        }
        _ => {}
    }
    Ok(())
}
