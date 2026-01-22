use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::types::*;
use sea_orm::{DatabaseConnection, DeriveDisplay, EntityTrait};

use crate::entities::{entry_sub_type, sub_type_property};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BasicGroup {
    pub id: String,
    pub name: String,
    pub properties: HashMap<String, ConfigOption>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ConfigOption {
    Single(PropertyConfig),
    Compound(CompoundPropertyConfig),
}

#[derive(Serialize, Deserialize, Clone, Debug, DeriveDisplay)]
#[serde(rename_all = "lowercase")]
pub enum FormFormat {
    File,
    Folder,
}

pub fn file_or_folder(entry_type: &GlossaryEntryType) -> FormFormat {
    match entry_type {
        GlossaryEntryType::Continent
        | GlossaryEntryType::Region
        | GlossaryEntryType::Nation
        | GlossaryEntryType::Territory
        | GlossaryEntryType::Landmark
        | GlossaryEntryType::Settlement
        | GlossaryEntryType::District
        | GlossaryEntryType::Collective => FormFormat::Folder,
        _ => FormFormat::File,
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PropertyConfig {
    pub id: PropertyId,
    pub name: String,
    pub value: serde_json::Value,
}

// impl PropertyConfig {
//     fn empty() -> Self {
//         Self {
//             id: PropertyId(String::new()),
//             name: String::new(),
//             value: serde_json::Value::Null,
//         }
//     }
// }

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CompoundPropertyConfig {
    pub id: PropertyId,
    pub name: String,
    pub order: Vec<String>,
    pub value: HashMap<String, CompoundPropertyValue>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CompoundPropertyValue {
    pub left: Box<PropertyConfig>,
    pub right: Box<PropertyConfig>,
}

// impl CompoundPropertyValue {
//     fn empty() -> Self {
//         Self {
//             left: Box::new(PropertyConfig::empty()),
//             right: Box::new(PropertyConfig::empty()),
//         }
//     }
// }

pub fn shape_to_property_config(
    shape: &NonCompoundPropertyShape,
    id: String,
    name: String,
) -> PropertyConfig {
    let value = match shape {
        NonCompoundPropertyShape::Text(s) => s
            .default_value
            .clone()
            .map(serde_json::Value::String)
            .unwrap_or(serde_json::Value::Null),
        NonCompoundPropertyShape::Dropdown(s) => {
            if s.select_type == DropdownSelectType::Multi {
                serde_json::Value::Array(vec![])
            } else {
                s.default_list
                    .as_ref()
                    .map(|list| {
                        serde_json::Value::Array(
                            list.iter()
                                .map(|s| serde_json::Value::String(s.clone()))
                                .collect(),
                        )
                    })
                    .unwrap_or(serde_json::Value::Null)
            }
        }
        NonCompoundPropertyShape::Checkbox(s) => serde_json::Value::Bool(s.default_checked != 0),
        NonCompoundPropertyShape::Date(_s) => serde_json::Value::String(String::new()),
        NonCompoundPropertyShape::Range(_s) => 0.into(),
    };

    PropertyConfig {
        id: PropertyId(id),
        name,
        value,
    }
}

pub fn generate_property_value(
    property: &sub_type_property::Model,
) -> Result<PropertyConfig, String> {
    let shape = property.parsed_shape().unwrap();

    match shape {
        PropertyShape::Compound(_) => Err("Property is of compound shape".to_string()),
        PropertyShape::Text(s) => Ok(shape_to_property_config(
            &NonCompoundPropertyShape::Text(s),
            property.id.clone(),
            property.name.clone(),
        )),
        PropertyShape::Dropdown(s) => Ok(shape_to_property_config(
            &NonCompoundPropertyShape::Dropdown(s),
            property.id.clone(),
            property.name.clone(),
        )),
        PropertyShape::Checkbox(s) => Ok(shape_to_property_config(
            &NonCompoundPropertyShape::Checkbox(s),
            property.id.clone(),
            property.name.clone(),
        )),
        PropertyShape::Date(s) => Ok(shape_to_property_config(
            &NonCompoundPropertyShape::Date(s),
            property.id.clone(),
            property.name.clone(),
        )),
        PropertyShape::Range(s) => Ok(shape_to_property_config(
            &NonCompoundPropertyShape::Range(s),
            property.id.clone(),
            property.name.clone(),
        )),
    }
}

pub fn generate_compound_property_value(
    property: &sub_type_property::Model,
    property_id: String,
) -> Result<CompoundPropertyConfig, String> {
    let shape = property.parsed_shape().unwrap();
    if let PropertyShape::Compound(compound_shape) = shape {
        let mut compound_config = CompoundPropertyConfig {
            id: PropertyId(property_id.clone()),
            name: property.name.clone(),
            order: Vec::new(),
            value: HashMap::new(),
        };

        let row_id = uuid::Uuid::new_v4().to_string();
        compound_config.order.push(row_id.clone());

        let left_vals = shape_to_property_config(
            &compound_shape.left.shape,
            uuid::Uuid::new_v4().to_string(),
            compound_shape.left.name.to_string(),
        );
        let right_vals = shape_to_property_config(
            &compound_shape.right.shape,
            uuid::Uuid::new_v4().to_string(),
            compound_shape.right.name.to_string(),
        );

        let value = CompoundPropertyValue {
            left: Box::new(left_vals),
            right: Box::new(right_vals),
        };

        Ok(CompoundPropertyConfig {
            id: PropertyId(property_id),
            name: property.name.clone(),
            order: vec![row_id.clone()],
            value: HashMap::from([(row_id, value)]),
        })
    } else {
        Err("Property is not of compound shape".to_string())
    }
}

#[derive(Clone)]
pub struct FormSource {
    pub name: String,
    pub format: FormFormat,
    pub entry_type: GlossaryEntryType,
    pub groups: HashMap<String, BasicGroup>,
    pub primary_anchor_id: Option<String>,
    pub secondary_anchor_id: Option<String>,
    pub primary_anchor_value: Option<String>,
    pub secondary_anchor_value: Option<String>,
}

impl std::fmt::Display for FormSource {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

pub async fn generate_form_source(
    sub_type_id: String,
    db: &DatabaseConnection,
) -> Result<FormSource, String> {
    let sub_type = entry_sub_type::Entity::find_by_id(sub_type_id)
        .one(db)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "SubType not found".to_string())?;

    let sub_type_obj: SubType = sub_type
        .clone()
        .try_into()
        .map_err(|e| format!("Failed to convert sub type: {}", e))?;

    let anchors = sub_type_obj.anchors;

    let groups_and_properties = sub_type
        .get_groups_and_properties(db)
        .await
        .map_err(|e| e.to_string())?;

    let mut result: HashMap<String, BasicGroup> = HashMap::new();
    for group in groups_and_properties.0 {
        let mut property_map: HashMap<String, ConfigOption> = HashMap::new();
        for property in group
            .fetch_properties(db)
            .await
            .map_err(|e| e.to_string())?
        {
            let property_value: ConfigOption;
            match property.parsed_shape().map_err(|e| e.to_string())? {
                PropertyShape::Compound(_) => {
                    let _compound_config =
                        generate_compound_property_value(&property, property.id.clone())?;
                    property_value = ConfigOption::Compound(_compound_config);
                }
                _ => {
                    let _config = generate_property_value(&property)?;
                    property_value = ConfigOption::Single(_config);
                }
            }
            property_map.insert(property.id.clone(), property_value);
        }
        result.insert(
            group.id.clone(),
            BasicGroup {
                id: group.id.clone(),
                name: group.name.clone(),
                properties: property_map,
            },
        );
    }

    Ok(FormSource {
        name: "New Entry".to_string(),
        format: file_or_folder(&sub_type_obj.entry_type),
        entry_type: sub_type_obj.entry_type.clone(),
        groups: result,
        primary_anchor_id: Some(anchors.primary.0),
        secondary_anchor_id: Some(anchors.secondary.0),
        primary_anchor_value: None,
        secondary_anchor_value: None,
    })
}
