use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;

use crate::{
    entities::{
        system_glossary, system_glossary_entry, system_glossary_node, system_sub_type,
        system_sub_type_group, system_sub_type_group_property, system_sub_type_property,
        system_sub_type_schema_group, user_backlink_index,
    },
    entries::BasicGroup,
    types::glossary_common::*,
    types::newtypes::*,
};

/*-------------------------------------------------------- */
/*----------------------Glossary Node----------------------*/
/*-------------------------------------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemGlossaryNode {
    pub id: NodeEntryId,
    pub name: String,
    pub entry_type: GlossaryEntryType,
    pub sub_type_id: SubTypeId,
    pub glossary_id: GlossaryId,
    pub sort_index: u32,
    pub icon: Option<String>, //for custom icon support eventually
    pub integration_state: Option<String>, // Still not sure how that's going to go one day.
    pub parent_id: Option<NodeEntryId>,
}

impl TryFrom<system_glossary_node::Model> for SystemGlossaryNode {
    type Error = String;

    fn try_from(model: system_glossary_node::Model) -> Result<Self, Self::Error> {
        Ok(SystemGlossaryNode {
            id: NodeEntryId(model.id),
            name: model.name,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .map_err(|_| "Invalid entry type".to_string())?,
            sub_type_id: SubTypeId(model.system_sub_type_id),
            glossary_id: GlossaryId(model.glossary_id),
            sort_index: model.sort_index as u32,
            icon: model.icon,
            integration_state: model.integration_state,
            parent_id: model.parent_id.map(NodeEntryId),
        })
    }
}

/*-------------------------------------------------------- */
/*----------------------Glossary Entry---------------------*/
/*-------------------------------------------------------- */

// COME BACK HERE WHEN THE INTEGRATION STATE IS DEFINED
// #[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct GlossaryEntryIntegrationState {

// }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryEntry {
    pub id: String,
    pub entry_type: GlossaryEntryType,
    pub sub_type_id: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub name: String,
    pub groups: HashMap<String, BasicGroup>,
    pub primary_anchor_id: Option<String>,
    pub primary_anchor_value: Option<String>,
    pub secondary_anchor_id: Option<String>,
    pub secondary_anchor_value: Option<String>,
}

impl TryFrom<system_glossary_entry::Model> for GlossaryEntry {
    type Error = String;

    fn try_from(model: system_glossary_entry::Model) -> Result<Self, Self::Error> {
        Ok(GlossaryEntry {
            id: model.id,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .map_err(|_| "Invalid entry type".to_string())?,
            sub_type_id: model.sub_type_id,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            name: model.name,
            groups: serde_json::from_str(&model.groups.unwrap_or_default())
                .map_err(|_| "Invalid groups".to_string())?,
            primary_anchor_id: model.primary_anchor_id,
            primary_anchor_value: model.primary_anchor_value,
            secondary_anchor_id: model.secondary_anchor_id,
            secondary_anchor_value: model.secondary_anchor_value,
        })
    }
}

/*-------------------------------------------------------- */
/*-------------------------Glossary------------------------*/
/*-------------------------------------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Glossary {
    id: GlossaryId,
    name: String,
    genre: String,
    sub_genre: String,
    description: Option<String>,
    created_by: String,
    created_at: DateTime,
    updated_at: DateTime,
    visibility: String,
    theme: GlossaryThemes,
    integration_state: HashMap<GlossaryEntryType, GlossaryEntrySettings>,
}

impl TryFrom<system_glossary::Model> for Glossary {
    type Error = String;

    fn try_from(model: system_glossary::Model) -> Result<Self, Self::Error> {
        Ok(Glossary {
            id: GlossaryId(model.id),
            name: model.name,
            genre: model.genre,
            created_by: String::new(),
            sub_genre: model.sub_genre,
            description: model.description,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            visibility: "{}".to_string(),
            theme: serde_json::from_str(&model.theme.unwrap_or_default()).unwrap_or_default(),
            integration_state: HashMap::new(),
        })
    }
}

/*-------------------------------------------------------- */
/*---------------------Subtype Property--------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SystemSubTypeProperty {
    pub id: PropertyId,
    pub name: String,
    pub input_type: InputTypeEnum,
    pub shape: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub display_name: Option<String>,
    pub smart_sync: Option<SmartLinkRulesShape>,
}

impl system_sub_type_property::Model {
    pub fn parsed_shape(&self) -> Result<PropertyShape, serde_json::Error> {
        let model_input_type =
            InputTypeEnum::from_str(&self.input_type).unwrap_or(InputTypeEnum::Text);
        match model_input_type {
            InputTypeEnum::Text => {
                let shape: TextPropertyShape = serde_json::from_str(&self.shape)?;
                Ok(PropertyShape::Text(shape))
            }
            InputTypeEnum::Dropdown => {
                let shape: DropdownPropertyShape = serde_json::from_str(&self.shape)?;
                Ok(PropertyShape::Dropdown(shape))
            }
            InputTypeEnum::Checkbox => {
                let shape: CheckboxPropertyShape = serde_json::from_str(&self.shape)?;
                Ok(PropertyShape::Checkbox(shape))
            }
            InputTypeEnum::Range => {
                let shape: RangePropertyShape = serde_json::from_str(&self.shape)?;
                Ok(PropertyShape::Range(shape))
            }
            InputTypeEnum::Date => {
                let shape: DatePropertyShape = serde_json::from_str(&self.shape)?;
                Ok(PropertyShape::Date(shape))
            }
            InputTypeEnum::Compound => {
                let shape: CompoundPropertyShape = serde_json::from_str(&self.shape)?;
                Ok(PropertyShape::Compound(shape))
            }
        }
    }
}

impl TryFrom<system_sub_type_property::Model> for SystemSubTypeProperty {
    type Error = String;

    fn try_from(model: system_sub_type_property::Model) -> Result<Self, Self::Error> {
        Ok(SystemSubTypeProperty {
            id: PropertyId(model.id.clone()),
            name: model.name.clone(),
            input_type: InputTypeEnum::from_str(&model.input_type)
                .map_err(|_| "Invalid input type".to_string())?,
            shape: model.shape.clone(),
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            display_name: model.display_name,
            smart_sync: SmartLinkRulesShape::from_json(&model.smart_sync.unwrap_or_default()).ok(),
        })
    }
}

/*-------------------------------------------------------- */
/*-------------------Subtype Property Link-----------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SystemSubTypePropertyLink {
    pub id: String,
    pub group_id: GroupId,
    pub property_id: Option<PropertyId>,
    pub system_property_id: Option<PropertyId>,
    pub order: i32,
}

impl TryFrom<system_sub_type_group_property::Model> for SystemSubTypePropertyLink {
    type Error = String;

    fn try_from(model: system_sub_type_group_property::Model) -> Result<Self, Self::Error> {
        Ok(SystemSubTypePropertyLink {
            id: model.id,
            group_id: GroupId(model.group_id),
            property_id: None,
            system_property_id: Some(PropertyId(model.property_id)),
            order: model.order,
        })
    }
}

/*-------------------------------------------------------- */
/*-----------------------Subtype Group---------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SystemSubTypeGroup {
    pub id: GroupId,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub name: String,
    pub display_name: Option<String>,
    pub display: Option<String>,
    pub description: Option<String>,
    pub properties: Option<Vec<SystemSubTypePropertyLink>>,
}

impl TryFrom<system_sub_type_group::Model> for SystemSubTypeGroup {
    type Error = String;

    fn try_from(model: system_sub_type_group::Model) -> Result<Self, Self::Error> {
        Ok(SystemSubTypeGroup {
            id: GroupId(model.id),
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            name: model.name.clone(),
            display_name: model.display_name,
            display: Some(model.display.unwrap_or_default()),
            description: model.description,
            properties: Some(Vec::new()),
        })
    }
}

// this needs to be reworked to include fetching system properties, too

impl system_sub_type_group::Model {
    pub async fn fetch_properties(
        &self,
        db: &impl sea_orm::ConnectionTrait,
    ) -> Result<Vec<system_sub_type_property::Model>, sea_orm::DbErr> {
        Ok(self
            .find_related(system_sub_type_group_property::Entity)
            .find_also_related(system_sub_type_property::Entity)
            .all(db)
            .await?
            .into_iter()
            .filter_map(|(_, property)| property)
            .collect())
    }
}

/*-------------------------------------------------------- */
/*--------------------Subtype Group Link-------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct SubTypeGroupLink {
    pub id: String,
    pub group_id: GroupId,
    pub subtype_id: SubTypeId,
    pub order: i32,
}

impl TryFrom<system_sub_type_schema_group::Model> for SubTypeGroupLink {
    type Error = String;

    fn try_from(model: system_sub_type_schema_group::Model) -> Result<Self, Self::Error> {
        Ok(SubTypeGroupLink {
            id: model.id,
            group_id: GroupId(model.group_id),
            subtype_id: SubTypeId(model.subtype_id),
            order: model.order,
        })
    }
}

/*-------------------------------------------------------- */
/*--------------------------Subtype------------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SystemSubType {
    pub id: SubTypeId,
    pub created_at: DateTime,
    pub created_by: String,
    pub updated_at: DateTime,
    pub name: String,
    pub entry_type: GlossaryEntryType,
    pub anchors: SemanticAnchors,
    pub context: String,
}

impl TryFrom<system_sub_type::Model> for SystemSubType {
    type Error = String;

    fn try_from(model: system_sub_type::Model) -> Result<Self, Self::Error> {
        Ok(SystemSubType {
            id: SubTypeId(model.id),
            created_at: parse_datetime(&model.created_at),
            created_by: "SYSTEM".to_string(),
            updated_at: parse_datetime(&model.updated_at),
            name: model.name,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .unwrap_or(GlossaryEntryType::Item),
            anchors: serde_json::from_str(&model.anchors)
                .map_err(|e| format!("Failed to parse anchors: {}", e))?,
            context: "".to_string(),
        })
    }
}

impl system_sub_type::Model {
    pub async fn get_groups_and_properties(
        &self,
        db: &sea_orm::DatabaseConnection,
    ) -> Result<
        (
            Vec<system_sub_type_group::Model>,
            Vec<system_sub_type_property::Model>,
        ),
        sea_orm::DbErr,
    > {
        let groups_with_properties = system_sub_type_schema_group::Entity::find()
            .filter(system_sub_type_schema_group::Column::SubtypeId.eq(self.id.clone()))
            .find_with_related(system_sub_type_group::Entity)
            .all(db)
            .await?;

        let mut result = (Vec::new(), Vec::new());
        for (group_link, group_models) in groups_with_properties {
            let group_model =
                group_models
                    .into_iter()
                    .next()
                    .ok_or(sea_orm::DbErr::RecordNotFound(
                        "SubTypeGroup not found".to_string(),
                    ))?;

            let properties: Vec<system_sub_type_property::Model> =
                system_sub_type_group_property::Entity::find()
                    .filter(
                        system_sub_type_group_property::Column::GroupId
                            .eq(group_link.group_id.clone()),
                    )
                    .find_with_related(system_sub_type_property::Entity)
                    .all(db)
                    .await?
                    .into_iter()
                    .filter_map(|(_, props)| props.into_iter().next())
                    .collect();

            result.0.push(group_model);
            result.1.extend(properties);
        }
        Ok(result)
    }
}

/*-------------------------------------------------------- */
/*----------------------Backlink Index---------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, Default)]
#[serde(rename_all = "camelCase")]
pub struct UserBacklinkIndex {
    pub id: String,
    pub source_id: NodeEntryId,
    pub target_id: NodeEntryId,
    pub r#type: BacklinkType,
    pub property_id: String,
    pub property_value: serde_json::Value,
    pub ignore_divergence: bool,
    pub target_ignore: bool,
    pub sub_property_id: Option<String>,
    pub last_synced_at: DateTime,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

impl TryFrom<user_backlink_index::Model> for UserBacklinkIndex {
    type Error = String;

    fn try_from(model: user_backlink_index::Model) -> Result<Self, Self::Error> {
        Ok(UserBacklinkIndex {
            id: model.id,
            source_id: NodeEntryId(model.source_id),
            target_id: NodeEntryId(model.target_id),
            r#type: model
                .r#type
                .as_ref()
                .and_then(|t| BacklinkType::from_str(t).ok())
                .unwrap_or(BacklinkType::Direct),
            property_id: model.property_id,
            property_value: serde_json::from_str(&model.property_value.unwrap_or_default())
                .map_err(|e| format!("Failed to parse property_value: {}", e))?,
            ignore_divergence: model.ignore_divergence != 0,
            last_synced_at: parse_datetime(&model.last_synced_at),
            target_ignore: model.target_ignore != 0,
            sub_property_id: model.sub_property_id,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
        })
    }
}
