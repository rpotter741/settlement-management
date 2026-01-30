use crate::{
    entities::{
        glossary_meta_data, user_glossary, user_glossary_entry, user_glossary_entry_metadata,
        user_glossary_node, user_sub_type, user_sub_type_group, user_sub_type_group_metadata,
        user_sub_type_group_property, user_sub_type_metadata, user_sub_type_property,
        user_sub_type_property_metadata, user_sub_type_schema_group,
    },
    entries::BasicGroup,
    impl_metadata_try_from,
    types::{
        CheckboxPropertyShape, CompoundPropertyShape, ContentMetaData, DatePropertyShape,
        DropdownPropertyShape, GlossaryEntrySettings, GlossaryEntryType, GlossaryId,
        GlossaryThemes, GroupId, InputTypeEnum, NodeEntryId, PropertyId, PropertyShape,
        RangePropertyShape, SemanticAnchors, SmartLinkRulesShape, SubTypeId, TextPropertyShape,
    },
    utility::parse_datetime,
};

use chrono::{DateTime as ChronoDateTime, Utc};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;

/*-------------------------------------------------------- */
/*----------------------Glossary Node----------------------*/
/*-------------------------------------------------------- */
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserGlossaryNode {
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

impl TryFrom<user_glossary_node::Model> for UserGlossaryNode {
    type Error = String;

    fn try_from(model: user_glossary_node::Model) -> Result<Self, Self::Error> {
        Ok(UserGlossaryNode {
            id: NodeEntryId(model.id),
            name: model.name,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .map_err(|_| "Invalid entry type".to_string())?,
            sub_type_id: SubTypeId(model.sub_type_id),
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
pub struct UserGlossaryEntry {
    pub id: String,
    pub created_by: String,
    pub entry_type: GlossaryEntryType,
    pub sub_type_id: String,
    pub created_at: ChronoDateTime<Utc>,
    pub updated_at: ChronoDateTime<Utc>,
    pub name: String,
    pub groups: HashMap<String, BasicGroup>,
    pub primary_anchor_id: Option<String>,
    pub primary_anchor_value: Option<String>,
    pub secondary_anchor_id: Option<String>,
    pub secondary_anchor_value: Option<String>,
    pub custom_properties: Option<String>,
}

impl TryFrom<user_glossary_entry::Model> for UserGlossaryEntry {
    type Error = String;

    fn try_from(model: user_glossary_entry::Model) -> Result<Self, Self::Error> {
        Ok(UserGlossaryEntry {
            id: model.id,
            created_by: model.created_by,
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
            custom_properties: model.custom_properties,
        })
    }
}

// for the entry metadata transformations
impl_metadata_try_from!(user_glossary_entry_metadata::Model);

/*-------------------------------------------------------- */
/*-------------------------Glossary------------------------*/
/*-------------------------------------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserGlossary {
    id: GlossaryId,
    name: String,
    genre: String,
    sub_genre: String,
    description: Option<String>,
    created_by: String,
    created_at: ChronoDateTime<Utc>,
    updated_at: ChronoDateTime<Utc>,
    visibility: String,
    theme: GlossaryThemes,
    integration_state: HashMap<GlossaryEntryType, GlossaryEntrySettings>,
}

impl TryFrom<user_glossary::Model> for UserGlossary {
    type Error = String;

    fn try_from(model: user_glossary::Model) -> Result<Self, Self::Error> {
        Ok(UserGlossary {
            id: GlossaryId(model.id),
            name: model.name,
            genre: model.genre,
            sub_genre: model.sub_genre,
            description: model.description,
            created_by: model.created_by,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            visibility: model.visibility,
            theme: serde_json::from_str(&model.theme.unwrap_or_default()).unwrap_or_default(),
            integration_state: serde_json::from_str(&model.integration_state.unwrap_or_default())
                .unwrap_or_default(),
        })
    }
}

// for the glossary metadata transformations
impl_metadata_try_from!(glossary_meta_data::Model);

/*-------------------------------------------------------- */
/*---------------------Subtype Property--------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserSubTypeProperty {
    pub id: PropertyId,
    pub name: String,
    pub input_type: InputTypeEnum,
    pub shape: String,
    pub created_by: String,
    pub created_at: ChronoDateTime<Utc>,
    pub updated_at: ChronoDateTime<Utc>,
    pub display_name: Option<String>,
    pub smart_sync: Option<SmartLinkRulesShape>,
    pub system: bool,
}

impl user_sub_type_property::Model {
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

impl TryFrom<user_sub_type_property::Model> for UserSubTypeProperty {
    type Error = String;

    fn try_from(model: user_sub_type_property::Model) -> Result<Self, Self::Error> {
        Ok(UserSubTypeProperty {
            id: PropertyId(model.id.clone()),
            name: model.name.clone(),
            input_type: InputTypeEnum::from_str(&model.input_type)
                .map_err(|_| "Invalid input type".to_string())?,
            shape: model.shape.clone(),
            created_by: model.created_by,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            display_name: model.display_name,
            smart_sync: SmartLinkRulesShape::from_json(&model.smart_sync.unwrap_or_default()).ok(),
            system: false,
        })
    }
}

// for the property metadata transformations
impl_metadata_try_from!(user_sub_type_property_metadata::Model);

/*-------------------------------------------------------- */
/*-------------------Subtype Property Link-----------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserSubTypePropertyLink {
    pub id: String,
    pub group_id: GroupId,
    pub property_id: Option<PropertyId>,
    pub system_property_id: Option<PropertyId>,
    pub order: i32,
}

impl TryFrom<user_sub_type_group_property::Model> for UserSubTypePropertyLink {
    type Error = String;

    fn try_from(model: user_sub_type_group_property::Model) -> Result<Self, Self::Error> {
        Ok(UserSubTypePropertyLink {
            id: model.id,
            group_id: GroupId(model.group_id),
            property_id: model.user_property_id.map(|id| PropertyId(id)),
            system_property_id: model.system_property_id.map(|id| PropertyId(id)),
            order: model.order,
        })
    }
}

/*-------------------------------------------------------- */
/*-----------------------Subtype Group---------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserSubTypeGroup {
    pub id: GroupId,
    pub created_by: String,
    pub created_at: ChronoDateTime<Utc>,
    pub updated_at: ChronoDateTime<Utc>,
    pub name: String,
    pub display_name: Option<String>,
    pub display: Option<String>,
    pub description: Option<String>,
    pub properties: Option<Vec<UserSubTypePropertyLink>>,
    pub system: bool,
}

impl TryFrom<user_sub_type_group::Model> for UserSubTypeGroup {
    type Error = String;

    fn try_from(model: user_sub_type_group::Model) -> Result<Self, Self::Error> {
        Ok(UserSubTypeGroup {
            id: GroupId(model.id),
            created_by: model.created_by,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            name: model.name.clone(),
            display_name: model.display_name,
            display: Some(model.display.unwrap_or_default()),
            description: model.description,
            properties: Some(Vec::new()),
            system: false,
        })
    }
}

// this needs to be reworked to include fetching system properties, too

impl user_sub_type_group::Model {
    pub async fn fetch_properties(
        &self,
        db: &impl sea_orm::ConnectionTrait,
    ) -> Result<Vec<user_sub_type_property::Model>, sea_orm::DbErr> {
        Ok(self
            .find_related(user_sub_type_group_property::Entity)
            .find_also_related(user_sub_type_property::Entity)
            .all(db)
            .await?
            .into_iter()
            .filter_map(|(_, property)| property)
            .collect())
    }
}

// for the group metadata transformations
impl_metadata_try_from!(user_sub_type_group_metadata::Model);

/*-------------------------------------------------------- */
/*--------------------Subtype Group Link-------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct UserSubTypeGroupLink {
    pub id: String,
    pub group_id: GroupId,
    pub subtype_id: SubTypeId,
    pub order: i32,
}

impl TryFrom<user_sub_type_schema_group::Model> for UserSubTypeGroupLink {
    type Error = String;

    fn try_from(model: user_sub_type_schema_group::Model) -> Result<Self, Self::Error> {
        Ok(UserSubTypeGroupLink {
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
pub struct UserSubType {
    pub id: SubTypeId,
    pub created_at: ChronoDateTime<Utc>,
    pub updated_at: ChronoDateTime<Utc>,
    pub name: String,
    pub entry_type: GlossaryEntryType,
    pub anchors: SemanticAnchors,
    pub context: Option<SubTypeId>,
    pub system: bool,
}

impl TryFrom<user_sub_type::Model> for UserSubType {
    type Error = String;

    fn try_from(model: user_sub_type::Model) -> Result<Self, Self::Error> {
        Ok(UserSubType {
            id: SubTypeId(model.id),
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            name: model.name,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .unwrap_or(GlossaryEntryType::Item),
            anchors: serde_json::from_str(&model.anchors)
                .map_err(|e| format!("Failed to parse anchors: {}", e))?,
            context: Some(SubTypeId(model.context)),
            system: false,
        })
    }
}

impl user_sub_type::Model {
    pub async fn get_groups_and_properties(
        &self,
        db: &sea_orm::DatabaseConnection,
    ) -> Result<
        (
            Vec<user_sub_type_group::Model>,
            Vec<user_sub_type_property::Model>,
        ),
        sea_orm::DbErr,
    > {
        let groups_with_properties = user_sub_type_schema_group::Entity::find()
            .filter(user_sub_type_schema_group::Column::SubtypeId.eq(self.id.clone()))
            .find_with_related(user_sub_type_group::Entity)
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

            let properties: Vec<user_sub_type_property::Model> =
                user_sub_type_group_property::Entity::find()
                    .filter(
                        user_sub_type_group_property::Column::GroupId
                            .eq(group_link.group_id.clone()),
                    )
                    .find_with_related(user_sub_type_property::Entity)
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

// for the subtype metadata transformations
impl_metadata_try_from!(user_sub_type_metadata::Model);
