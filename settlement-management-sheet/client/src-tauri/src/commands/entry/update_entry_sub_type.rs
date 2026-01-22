use crate::entities::entry_sub_type;
use crate::entities::glossary_entry;
use crate::entities::glossary_node;
use crate::entries::{generate_form_source, BasicGroup, ConfigOption, FormSource};
use crate::types::GlossaryEntry;
use crate::types::NodeEntryId;
use crate::types::PropertyId;
use crate::types::SubTypeId;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};
use std::collections::HashMap;

#[tauri::command]
pub async fn update_entry_sub_type(
    db: tauri::State<'_, DatabaseConnection>,
    entry_id: NodeEntryId,
    sub_type_id: SubTypeId,
) -> Result<GlossaryEntry, String> {
    /*---------------------------------------------------------------------- */
    /*----------------- Generate form source and get db data --------------- */
    /*---------------------------------------------------------------------- */
    let mut new_form_source: FormSource = generate_form_source(sub_type_id.0.clone(), &db).await?;

    let _new_sub_type = entry_sub_type::Entity::find()
        .filter(entry_sub_type::Column::Id.eq(sub_type_id.0.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Entry sub type not found".to_string())?;

    let existing_model = glossary_entry::Entity::find()
        .filter(glossary_entry::Column::Id.eq(entry_id.0.clone()))
        .one(db.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "Glossary entry not found".to_string())?;

    let _existing_entry: GlossaryEntry = GlossaryEntry::try_from(existing_model)?;

    /*---------------------------------------------------------------------- */
    /*---------------- Map over existing properties & values --------------- */
    /*---------------------------------------------------------------------- */

    let mut existing_properties: HashMap<PropertyId, ConfigOption> = HashMap::new();
    let existing_groups = _existing_entry.groups.clone();

    for group in existing_groups.values() {
        for property in group.properties.values() {
            match property {
                ConfigOption::Single(single_property) => {
                    existing_properties.insert(
                        single_property.id.clone(),
                        ConfigOption::Single(single_property.clone()),
                    );
                }
                ConfigOption::Compound(compound_property) => {
                    existing_properties.insert(
                        compound_property.id.clone(),
                        ConfigOption::Compound(compound_property.clone()),
                    );
                }
            }
        }
    }
    let mut merged_groups: HashMap<String, BasicGroup> = HashMap::new();
    let mut primary_anchor_value: Option<String> = None;
    let mut secondary_anchor_value: Option<String> = None;

    for group in new_form_source.groups.values() {
        let mut merged_properties: HashMap<String, ConfigOption> = HashMap::new();

        for (id, new_property) in &group.properties {
            // 1. Check if we have existing data for this ID
            if new_form_source.primary_anchor_id.as_ref() == Some(id) {
                primary_anchor_value =
                    existing_properties
                        .get(&PropertyId(id.clone()))
                        .map(|p| match p {
                            ConfigOption::Single(single) => {
                                single.value.as_str().unwrap_or("").to_string()
                            }
                            ConfigOption::Compound(_compound) => "".to_string(),
                        });
            }
            if new_form_source.secondary_anchor_id.as_ref() == Some(id) {
                secondary_anchor_value =
                    existing_properties
                        .get(&PropertyId(id.clone()))
                        .map(|p| match p {
                            ConfigOption::Single(single) => {
                                single.value.as_str().unwrap_or("").to_string()
                            }
                            ConfigOption::Compound(_compound) => "".to_string(),
                        });
            }
            let property_to_insert =
                if let Some(existing) = existing_properties.get(&PropertyId(id.clone())) {
                    // Optional: Check if types match (Single vs Compound)
                    // before deciding to use the existing one
                    existing.clone()
                } else {
                    // 2. If not found, use the blank one from the new source
                    new_property.clone()
                };

            merged_properties.insert(id.clone(), property_to_insert.clone());
        }

        merged_groups.insert(
            group.id.clone(),
            BasicGroup {
                id: group.id.clone(),
                name: group.name.clone(),
                properties: merged_properties,
            },
        );
    }

    let serialized_groups = serde_json::to_string(&merged_groups).map_err(|e| e.to_string())?;

    new_form_source.groups = merged_groups;
    new_form_source.primary_anchor_value = primary_anchor_value;
    new_form_source.secondary_anchor_value = secondary_anchor_value;

    let txn = db.begin().await.map_err(|e| e.to_string())?;

    let updated_entry = glossary_entry::ActiveModel {
        id: Set(entry_id.0.clone()),
        name: Set(new_form_source.name.clone()),
        sub_type_id: Set(sub_type_id.0.clone()),
        format: Set(new_form_source.format.clone().to_string()),
        entry_type: Set(new_form_source.entry_type.clone().to_string()),
        groups: Set(Some(serialized_groups)),
        primary_anchor_id: Set(new_form_source.primary_anchor_id.clone()),
        secondary_anchor_id: Set(new_form_source.secondary_anchor_id.clone()),
        primary_anchor_value: Set(new_form_source.primary_anchor_value.clone()),
        secondary_anchor_value: Set(new_form_source.secondary_anchor_value.clone()),
        updated_at: Set(chrono::Utc::now()
            .naive_utc()
            .format("%Y-%m-%d %H:%M:%S")
            .to_string()),
        ..Default::default()
    };

    let updated_model = updated_entry
        .update(&txn)
        .await
        .map_err(|e| e.to_string())?;

    let update_node = glossary_node::ActiveModel {
        id: Set(entry_id.0.clone()),
        sub_type_id: Set(sub_type_id.0.clone()),
        ..Default::default()
    };
    update_node.update(&txn).await.map_err(|e| e.to_string())?;

    txn.commit().await.map_err(|e| e.to_string())?;

    Ok(updated_model
        .try_into()
        .map_err(|e| format!("Failed to convert updated model: {}", e))?)
}
