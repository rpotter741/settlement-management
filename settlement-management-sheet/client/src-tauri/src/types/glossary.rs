use chrono::{DateTime as ChronoDateTime, Utc};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;

use crate::{
    entities::{
        backlink_index, entry_sub_type, glossary, glossary_entry, glossary_node, sub_type_group,
        sub_type_group_property, sub_type_property, sub_type_schema_group,
    },
    entries::BasicGroup,
    types::{GlossaryId, GroupId, NodeEntryId, PropertyId, SubTypeId},
};

/*-------------------------------------------------------- */
/*----------------------Glossary Node----------------------*/
/*-------------------------------------------------------- */
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryNode {
    pub id: NodeEntryId,
    pub name: String,
    pub entry_type: GlossaryEntryType,
    pub file_type: String, // do I even need this?!?!?!?! im starting to think le no
    pub sub_type_id: SubTypeId,
    pub glossary_id: GlossaryId,
    pub sort_index: u32,
    pub icon: Option<String>, //for custom icon support eventually
    pub integration_state: Option<String>, // Still not sure how that's going to go one day.
    pub parent_id: Option<NodeEntryId>,
}

impl TryFrom<glossary_node::Model> for GlossaryNode {
    type Error = String;

    fn try_from(model: glossary_node::Model) -> Result<Self, Self::Error> {
        Ok(GlossaryNode {
            id: NodeEntryId(model.id),
            name: model.name,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .map_err(|_| "Invalid entry type".to_string())?,
            file_type: model.file_type,
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
pub struct GlossaryEntry {
    pub id: String,
    pub content_type: String,
    pub created_by: String,
    pub format: String,
    pub entry_type: GlossaryEntryType,
    pub sub_type_id: String,
    pub ref_id: String,
    pub version: i32,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub forked_by: Vec<String>,
    pub collaborators: Vec<String>,
    pub editors: Vec<String>,
    pub deleted_at: Option<DateTime>,
    pub is_immutable: bool,
    pub name: String,
    pub groups: HashMap<String, BasicGroup>,
    pub primary_anchor_id: Option<String>,
    pub primary_anchor_value: Option<String>,
    pub secondary_anchor_id: Option<String>,
    pub secondary_anchor_value: Option<String>,
    pub tags: Option<String>,
    pub integration_state: Option<String>,
}

impl TryFrom<glossary_entry::Model> for GlossaryEntry {
    type Error = String;

    fn try_from(model: glossary_entry::Model) -> Result<Self, Self::Error> {
        Ok(GlossaryEntry {
            id: model.id,
            content_type: model.content_type,
            created_by: model.created_by,
            format: model.format,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .map_err(|_| "Invalid entry type".to_string())?,
            sub_type_id: model.sub_type_id,
            ref_id: model.ref_id,
            version: model.version,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            forked_by: parse_csv_list(model.forked_by),
            collaborators: parse_csv_list(model.collaborators),
            editors: parse_csv_list(model.editors),
            deleted_at: model
                .deleted_at
                .and_then(|d| ChronoDateTime::parse_from_rfc3339(&d).ok())
                .map(|dt| dt.naive_utc()),
            is_immutable: model.is_immutable != 0,
            name: model.name,
            groups: serde_json::from_str(&model.groups.unwrap_or_default())
                .map_err(|_| "Invalid groups".to_string())?,
            primary_anchor_id: model.primary_anchor_id,
            primary_anchor_value: model.primary_anchor_value,
            secondary_anchor_id: model.secondary_anchor_id,
            secondary_anchor_value: model.secondary_anchor_value,
            tags: model.tags,
            integration_state: model.integration_state,
        })
    }
}

/*-------------------------------------------------------- */
/*-------------------------Glossary------------------------*/
/*-------------------------------------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct EntryTypeVisibility {
    pub collaborator: bool,
    pub player: bool,
    pub resident: bool,
    pub public: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GlossaryEntrySettings {
    default: String,
    visibility: EntryTypeVisibility,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryBackgrounds {
    paper: String,
    default: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryColors {
    primary: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryTheme {
    background: GlossaryBackgrounds,
    primary: GlossaryColors,
    secondary: GlossaryColors,
    accent: GlossaryColors,
}
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryThemes {
    light: GlossaryTheme,
    dark: GlossaryTheme,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Glossary {
    id: GlossaryId,
    name: String,
    genre: String,
    sub_genre: String,
    description: String,
    created_by: String,
    content_type: String,
    ref_id: String,
    version: i32,
    created_at: DateTime,
    updated_at: DateTime,
    is_immutable: bool,
    visibility: GlossaryEntrySettings,
    collaborators: Option<Vec<String>>,
    forked_by: Option<Vec<String>>,
    editors: Option<Vec<String>>,
    deleted_at: Option<DateTime>,
    theme: GlossaryThemes,
    integration_state: HashMap<GlossaryEntryType, GlossaryEntrySettings>,
}

impl TryFrom<glossary::Model> for Glossary {
    type Error = String;

    fn try_from(model: glossary::Model) -> Result<Self, Self::Error> {
        Ok(Glossary {
            id: GlossaryId(model.id),
            name: model.name,
            genre: model.genre,
            sub_genre: model.sub_genre,
            description: model.description,
            created_by: model.created_by,
            content_type: model.content_type,
            ref_id: model.ref_id,
            version: model.version,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            is_immutable: model.is_immutable != 0,
            visibility: serde_json::from_str(&model.visibility)
                .map_err(|_| "Invalid visibility".to_string())?,
            collaborators: Some(parse_csv_list(model.collaborators)),
            forked_by: Some(parse_csv_list(model.forked_by)),
            editors: Some(parse_csv_list(model.editors)),
            deleted_at: model
                .deleted_at
                .and_then(|d| ChronoDateTime::parse_from_rfc3339(&d).ok())
                .map(|dt| dt.naive_utc()),
            theme: serde_json::from_str(&model.theme.unwrap_or_default())
                .map_err(|_| "Invalid theme".to_string())?,
            integration_state: serde_json::from_str(&model.integration_state.unwrap_or_default())
                .map_err(|_| "Invalid integration state".to_string())?,
        })
    }
}

/*-------------------------------------------------------- */
/*---------------------Subtype Property--------------------*/
/*-------------------------------------------------------- */

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, DeriveActiveEnum, EnumIter, Default,
)]
#[sea_orm(rs_type = "String", db_type = "Text")]
pub enum InputTypeEnum {
    #[sea_orm(string_value = "text")]
    Text,
    #[sea_orm(string_value = "date")]
    Date,
    #[sea_orm(string_value = "range")]
    Range,
    #[sea_orm(string_value = "checkbox")]
    Checkbox,
    #[sea_orm(string_value = "dropdown")]
    Dropdown,
    #[sea_orm(string_value = "compound")]
    Compound,
    #[sea_orm(string_value = "default")]
    #[default]
    Default,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum TextPropertyInputType {
    Text,
    Number,
    RichText,
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub enum TextPropertyTextTransform {
    None,
    Uppercase,
    Lowercase,
    Capitalize,
    #[default]
    Default,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TextPropertyShape {
    pub input_type: TextPropertyInputType,
    pub default_value: Option<String>,
    pub text_transform: TextPropertyTextTransform,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Clone)]
#[serde(rename_all = "camelCase")]
pub enum DropdownSelectType {
    Single,
    Multi,
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub enum DropdownOptionType {
    List,
    EntryType,
    #[default]
    Default,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DropdownPropertyShape {
    pub select_type: DropdownSelectType,
    pub option_type: DropdownOptionType,
    pub default_list: Option<Vec<String>>,
    pub max_selections: Option<i32>,
    pub relationship: Option<Vec<GlossaryEntryType>>,
    pub options: Option<Vec<String>>,
    pub is_compound: i32,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CheckboxPropertyShape {
    pub default_checked: i32,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RangePropertyShape {
    pub is_number: i32,
    pub min: Option<f64>,
    pub max: Option<f64>,
    pub step: Option<f64>,
    pub label: String,
    pub options: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DatePropertyShape {}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum NonCompoundPropertyShape {
    Text(TextPropertyShape),
    Dropdown(DropdownPropertyShape),
    Checkbox(CheckboxPropertyShape),
    Range(RangePropertyShape),
    Date(DatePropertyShape),
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CompoundPropertyShape {
    pub left: Box<SubTypeSubProperty>,
    pub right: Box<SubTypeSubProperty>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum PropertyShape {
    Text(TextPropertyShape),
    Dropdown(DropdownPropertyShape),
    Checkbox(CheckboxPropertyShape),
    Range(RangePropertyShape),
    Date(DatePropertyShape),
    Compound(CompoundPropertyShape),
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubTypeSubProperty {
    pub id: String,
    pub name: String,
    pub input_type: InputTypeEnum,
    pub shape: NonCompoundPropertyShape,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum SmartLinkTarget {
    Child,
    Sibling,
    Parent,
    Backlink,
    EntryType,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum SmartLinkScope {
    Branch,
    Global,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SmartLinkParameters {
    types: Vec<GlossaryEntryType>,
    property_match: Option<bool>,
    scope: Option<SmartLinkScope>,
    limit: Option<i32>,
    closest: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SmartLinkRulesShape {
    operand: String,
    depth: i32,
    target: SmartLinkTarget,
    parameters: SmartLinkParameters,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubTypeProperty {
    pub id: PropertyId,
    pub ref_id: String,
    pub version: i32,
    pub content_type: String,
    pub name: String,
    pub input_type: InputTypeEnum,
    pub shape: PropertyShape,
    pub created_by: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub deleted_at: Option<DateTime>,
    pub display_name: Option<String>,
    pub smart_sync: Option<SmartLinkRulesShape>,
    pub is_generic: bool,
}

impl sub_type_property::Model {
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
            InputTypeEnum::Default => Err(serde_json::Error::io(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "Default input type",
            ))),
        }
    }
}

impl TryFrom<sub_type_property::Model> for SubTypeProperty {
    type Error = String;

    fn try_from(model: sub_type_property::Model) -> Result<Self, Self::Error> {
        Ok(SubTypeProperty {
            id: PropertyId(model.id.clone()),
            ref_id: model.ref_id.clone(),
            version: model.version.clone(),
            content_type: model.content_type.clone(),
            name: model.name.clone(),
            input_type: InputTypeEnum::from_str(&model.input_type)
                .map_err(|_| "Invalid input type".to_string())?,
            shape: model
                .parsed_shape()
                .map_err(|_| "Invalid shape".to_string())?,
            created_by: model.created_by,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            deleted_at: model
                .deleted_at
                .and_then(|d| ChronoDateTime::parse_from_rfc3339(&d).ok())
                .map(|dt| dt.naive_utc()),
            display_name: model.display_name,
            smart_sync: model.smart_sync.and_then(|m| serde_json::from_str(&m).ok()),
            is_generic: model.is_generic != 0,
        })
    }
}

/*-------------------------------------------------------- */
/*-------------------Subtype Property Link-----------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubTypePropertyLink {
    pub id: String,
    pub group_id: GroupId,
    pub property_id: PropertyId,
    pub order: i32,
}

impl TryFrom<sub_type_group_property::Model> for SubTypePropertyLink {
    type Error = String;

    fn try_from(model: sub_type_group_property::Model) -> Result<Self, Self::Error> {
        Ok(SubTypePropertyLink {
            id: model.id,
            group_id: GroupId(model.group_id),
            property_id: PropertyId(model.property_id),
            order: model.order,
        })
    }
}

/*-------------------------------------------------------- */
/*-----------------------Subtype Group---------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DisplayColumn {
    pub columns: i32,
}
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubTypeGroup {
    pub id: GroupId,
    pub ref_id: String,
    pub version: i32,
    pub content_type: String,
    pub created_by: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub deleted_at: Option<DateTime>,
    pub name: String,
    pub display_name: Option<String>,
    pub display: HashMap<PropertyId, DisplayColumn>,
    pub description: String,
    pub is_generic: bool,
}

impl TryFrom<sub_type_group::Model> for SubTypeGroup {
    type Error = String;

    fn try_from(model: sub_type_group::Model) -> Result<Self, Self::Error> {
        Ok(SubTypeGroup {
            id: GroupId(model.id),
            ref_id: model.ref_id,
            version: model.version,
            content_type: model.content_type,
            created_by: model.created_by,
            created_at: parse_datetime(&model.created_at),
            updated_at: parse_datetime(&model.updated_at),
            deleted_at: model
                .deleted_at
                .and_then(|d| ChronoDateTime::parse_from_rfc3339(&d).ok())
                .map(|dt| dt.naive_utc()),
            name: model.name.clone(),
            display_name: model.display_name,
            display: serde_json::from_str(&model.display.unwrap_or_default())
                .map_err(|e| format!("Failed to parse display: {}", e))?,
            description: model.description,
            is_generic: model.is_generic != 0,
        })
    }
}

impl sub_type_group::Model {
    pub async fn fetch_properties(
        &self,
        db: &impl sea_orm::ConnectionTrait,
    ) -> Result<Vec<sub_type_property::Model>, sea_orm::DbErr> {
        Ok(self
            .find_related(sub_type_group_property::Entity)
            .find_also_related(sub_type_property::Entity)
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
    pub schema_id: SubTypeId,
    pub order: i32,
}

impl TryFrom<sub_type_schema_group::Model> for SubTypeGroupLink {
    type Error = String;

    fn try_from(model: sub_type_schema_group::Model) -> Result<Self, Self::Error> {
        Ok(SubTypeGroupLink {
            id: model.id,
            group_id: GroupId(model.group_id),
            schema_id: SubTypeId(model.schema_id),
            order: model.order,
        })
    }
}

/*-------------------------------------------------------- */
/*--------------------------Subtype------------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SemanticAnchors {
    pub primary: PropertyId,
    pub secondary: PropertyId,
}

#[derive(Serialize, Deserialize, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubType {
    pub id: SubTypeId,
    // pub created_at: DateTime, --> add to schema I guess
    pub updated_at: DateTime,
    pub deleted_at: Option<DateTime>,
    pub name: String,
    pub ref_id: String,
    pub version: i32,
    pub forked_by: Option<Vec<String>>,
    pub collaborators: Option<Vec<String>>,
    pub editors: Option<Vec<String>>,
    pub is_immutable: bool,
    pub entry_type: GlossaryEntryType,
    pub anchors: SemanticAnchors,
    pub status: String,
    pub is_generic: bool,
    pub context: Option<SubTypeId>,
}

impl TryFrom<entry_sub_type::Model> for SubType {
    type Error = String;

    fn try_from(model: entry_sub_type::Model) -> Result<Self, Self::Error> {
        Ok(SubType {
            id: SubTypeId(model.id),
            // created_at: ChronoDateTime::parse_from_rfc3339(&model.created_at)
            //     .map(|dt| dt.naive_utc())
            //     .unwrap_or_else(|_| Utc::now().naive_utc()),
            updated_at: parse_datetime(&model.updated_at),
            deleted_at: model
                .deleted_at
                .and_then(|d| ChronoDateTime::parse_from_rfc3339(&d).ok())
                .map(|dt| dt.naive_utc()),
            name: model.name,
            ref_id: model.ref_id,
            version: model.version,
            forked_by: Some(parse_csv_list(model.forked_by)),
            collaborators: Some(parse_csv_list(model.collaborators)),
            editors: Some(parse_csv_list(model.editors)),
            is_immutable: model.is_immutable != 0,
            entry_type: GlossaryEntryType::from_str(&model.entry_type)
                .unwrap_or(GlossaryEntryType::Item),
            anchors: serde_json::from_str(&model.anchors.unwrap_or_default())
                .map_err(|e| format!("Failed to parse anchors: {}", e))?,
            status: model.status,
            is_generic: model.is_generic != 0,
            context: model.context.map(SubTypeId),
        })
    }
}

impl entry_sub_type::Model {
    pub async fn get_groups_and_properties(
        &self,
        db: &sea_orm::DatabaseConnection,
    ) -> Result<(Vec<sub_type_group::Model>, Vec<sub_type_property::Model>), sea_orm::DbErr> {
        let groups_with_properties = sub_type_schema_group::Entity::find()
            .filter(sub_type_schema_group::Column::SchemaId.eq(self.id.clone()))
            .find_with_related(sub_type_group::Entity)
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

            let properties: Vec<sub_type_property::Model> = sub_type_group_property::Entity::find()
                .filter(sub_type_group_property::Column::GroupId.eq(group_link.group_id.clone()))
                .find_with_related(sub_type_property::Entity)
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

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub enum BacklinkType {
    Direct,
    Compound,
    Indirect,
    Projection,
    #[default]
    Default,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, Default)]
#[serde(rename_all = "camelCase")]
pub struct BacklinkIndex {
    pub id: String,
    pub source_id: NodeEntryId,
    pub target_id: NodeEntryId,
    pub r#type: BacklinkType,
    pub property_id: PropertyId,
    pub property_value: serde_json::Value,
    pub ignore_divergence: bool,
    pub target_ignore: bool,
    pub sub_property_id: Option<String>,
    pub last_synced_at: DateTime,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

impl TryFrom<backlink_index::Model> for BacklinkIndex {
    type Error = String;

    fn try_from(model: backlink_index::Model) -> Result<Self, Self::Error> {
        Ok(BacklinkIndex {
            id: model.id,
            source_id: NodeEntryId(model.source_id),
            target_id: NodeEntryId(model.target_id),
            r#type: model
                .r#type
                .as_ref()
                .and_then(|t| BacklinkType::from_str(t).ok())
                .unwrap_or(BacklinkType::Direct),
            property_id: PropertyId(model.property_id),
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

/*-------------------------------------------------------- */
/*--------------------------Common-------------------------*/
/*-------------------------------------------------------- */
#[derive(
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
    EnumIter,
    DeriveActiveEnum,
    Serialize,
    Deserialize,
    DeriveDisplay,
    Hash,
    Default,
)]
#[sea_orm(rs_type = "String", db_type = "Text")]
#[serde(rename_all = "camelCase")]
pub enum GlossaryEntryType {
    #[sea_orm(string_value = "continent")]
    Continent,
    #[sea_orm(string_value = "region")]
    Region,
    #[sea_orm(string_value = "nation")]
    Nation,
    #[sea_orm(string_value = "territory")]
    Territory,
    #[sea_orm(string_value = "landmark")]
    Landmark,
    #[sea_orm(string_value = "settlement")]
    Settlement,
    #[sea_orm(string_value = "district")]
    District,
    #[sea_orm(string_value = "collective")]
    Collective,
    #[sea_orm(string_value = "item")]
    Item,
    #[sea_orm(string_value = "event")]
    Event,
    #[sea_orm(string_value = "lore")]
    Lore,
    #[sea_orm(string_value = "person")]
    Person,
    #[sea_orm(string_value = "location")]
    Location,
    #[sea_orm(string_value = "default")]
    #[default]
    Default,
}

impl FromStr for GlossaryEntryType {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "continent" => Ok(GlossaryEntryType::Continent),
            "region" => Ok(GlossaryEntryType::Region),
            "nation" => Ok(GlossaryEntryType::Nation),
            "territory" => Ok(GlossaryEntryType::Territory),
            "landmark" => Ok(GlossaryEntryType::Landmark),
            "settlement" => Ok(GlossaryEntryType::Settlement),
            "district" => Ok(GlossaryEntryType::District),
            "collective" => Ok(GlossaryEntryType::Collective),
            "item" => Ok(GlossaryEntryType::Item),
            "event" => Ok(GlossaryEntryType::Event),
            "lore" => Ok(GlossaryEntryType::Lore),
            "person" => Ok(GlossaryEntryType::Person),
            "location" => Ok(GlossaryEntryType::Location),
            "default" => Ok(GlossaryEntryType::Default),
            _ => Err(format!("Unknown entry type: {}", s)),
        }
    }
}

impl FromStr for InputTypeEnum {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "text" => Ok(InputTypeEnum::Text),
            "date" => Ok(InputTypeEnum::Date),
            "range" => Ok(InputTypeEnum::Range),
            "checkbox" => Ok(InputTypeEnum::Checkbox),
            "dropdown" => Ok(InputTypeEnum::Dropdown),
            "compound" => Ok(InputTypeEnum::Compound),
            "default" => Ok(InputTypeEnum::Default),
            _ => Err(format!("Unknown input type: {}", s)),
        }
    }
}

impl FromStr for BacklinkType {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "direct" => Ok(BacklinkType::Direct),
            "indirect" => Ok(BacklinkType::Indirect),
            "compound" => Ok(BacklinkType::Compound),
            "projection" => Ok(BacklinkType::Projection),
            "default" => Ok(BacklinkType::Default),
            _ => Err(format!("Unknown backlink type: {}", s)),
        }
    }
}

/*-------------------------------------------------------- */
/*-------------------------Utilities-----------------------*/
/*-------------------------------------------------------- */
pub fn parse_csv_list(s: Option<String>) -> Vec<String> {
    s.unwrap_or_default()
        .split(',')
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string())
        .collect()
}

pub fn parse_datetime(s: &str) -> DateTime {
    ChronoDateTime::parse_from_rfc3339(s)
        .map(|dt| dt.naive_utc())
        .unwrap_or_else(|_| Utc::now().naive_utc())
}

pub fn bool_to_sqlite(b: bool) -> i32 {
    if b {
        1
    } else {
        0
    }
}

pub fn sqlite_to_bool(i: i32) -> bool {
    i != 0
}

pub fn get_now() -> String {
    chrono::Utc::now().to_rfc3339()
}
