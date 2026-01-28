use crate::types::PropertyId;
use chrono::{DateTime as ChronoDateTime, Utc};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use std::str::FromStr;

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
    pub default: String,
    pub visibility: EntryTypeVisibility,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryBackgrounds {
    pub paper: String,
    pub default: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryColors {
    pub main: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryTheme {
    pub background: GlossaryBackgrounds,
    pub primary: GlossaryColors,
    pub secondary: GlossaryColors,
    pub tertiary: GlossaryColors,
    pub accent: GlossaryColors,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlossaryThemes {
    pub light: GlossaryTheme,
    pub dark: GlossaryTheme,
}

impl Default for GlossaryThemes {
    fn default() -> Self {
        GlossaryThemes {
            light: GlossaryTheme {
                background: GlossaryBackgrounds {
                    paper: String::from("#fbf7ef"),
                    default: String::from("#f5f0e6"),
                },
                primary: GlossaryColors {
                    main: String::from("#9e2a2b"),
                },
                secondary: GlossaryColors {
                    main: String::from("#3e5c76"),
                },
                tertiary: GlossaryColors {
                    main: String::from("#d49f38"),
                },
                accent: GlossaryColors {
                    main: String::from("#e09f3e"),
                },
            },
            dark: GlossaryTheme {
                background: GlossaryBackgrounds {
                    paper: String::from("#1e1e1e"),
                    default: String::from("#121212"),
                },
                primary: GlossaryColors {
                    main: String::from("#c65859"),
                },
                secondary: GlossaryColors {
                    main: String::from("#4a6e8f"),
                },
                tertiary: GlossaryColors {
                    main: String::from("#d49f38"),
                },
                accent: GlossaryColors {
                    main: String::from("#e09f3e"),
                },
            },
        }
    }
}

/*-------------------------------------------------------- */
/*---------------------Subtype Property--------------------*/
/*-------------------------------------------------------- */

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, DeriveActiveEnum, EnumIter, Default,
)]
#[sea_orm(rs_type = "String", db_type = "Text")]
#[serde(rename_all = "lowercase")]
pub enum InputTypeEnum {
    #[default]
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
    #[default]
    None,
    Uppercase,
    Lowercase,
    Capitalize,
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
    pub is_compound: bool,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CheckboxPropertyShape {
    pub default_checked: bool,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RangePropertyShape {
    pub is_number: bool,
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
    pub is_projection: bool,
}

impl CompoundPropertyShape {
    pub fn from_json(json: &str) -> Result<Self, String> {
        #[derive(Serialize, Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct RawSubProperty {
            id: String,
            name: String,
            input_type: String,
            shape: serde_json::Value,
        }

        #[derive(Serialize, Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct RawCompound {
            left: RawSubProperty,
            right: RawSubProperty,
            is_projection: Option<bool>,
        }

        fn parse_sub_property(raw: RawSubProperty) -> Result<NonCompoundPropertyShape, String> {
            match raw.input_type.to_lowercase().as_str() {
                "text" => {
                    let shape: TextPropertyShape = serde_json::from_value(raw.shape)
                        .map_err(|e| format!("Failed to parse text shape: {}", e))?;
                    Ok(NonCompoundPropertyShape::Text(shape))
                }
                "dropdown" => {
                    let shape: DropdownPropertyShape = serde_json::from_value(raw.shape)
                        .map_err(|e| format!("Failed to parse dropdown shape: {}", e))?;
                    Ok(NonCompoundPropertyShape::Dropdown(shape))
                }
                "checkbox" => {
                    let shape: CheckboxPropertyShape = serde_json::from_value(raw.shape)
                        .map_err(|e| format!("Failed to parse checkbox shape: {}", e))?;
                    Ok(NonCompoundPropertyShape::Checkbox(shape))
                }
                "range" => {
                    let shape: RangePropertyShape = serde_json::from_value(raw.shape)
                        .map_err(|e| format!("Failed to parse range shape: {}", e))?;
                    Ok(NonCompoundPropertyShape::Range(shape))
                }
                "date" => {
                    let shape: DatePropertyShape = serde_json::from_value(raw.shape)
                        .map_err(|e| format!("Failed to parse date shape: {}", e))?;
                    Ok(NonCompoundPropertyShape::Date(shape))
                }
                _ => Err(format!("Unknown input type: {}", raw.input_type)),
            }
        }

        let raw: RawCompound = serde_json::from_str(json)
            .map_err(|e| format!("Failed to parse raw compound shape: {}", e))?;

        let left = SubTypeSubProperty {
            id: raw.left.id.clone(),
            name: raw.left.name.clone(),
            input_type: (raw.left.input_type.clone()),
            shape: parse_sub_property(raw.left)?,
        };

        let right = SubTypeSubProperty {
            id: raw.right.id.clone(),
            name: raw.right.name.clone(),
            input_type: (raw.right.input_type.clone()),
            shape: parse_sub_property(raw.right)?,
        };

        Ok(CompoundPropertyShape {
            left: Box::new(left),
            right: Box::new(right),
            is_projection: raw.is_projection.unwrap_or(false),
        })
    }
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

impl PropertyShape {
    pub fn from_json_and_type(json: &str, input_type: &str) -> Result<Self, String> {
        match input_type.to_lowercase().as_str() {
            "text" => {
                let shape: TextPropertyShape = serde_json::from_str(json)
                    .map_err(|e| format!("Failed to parse text shape: {}", e))?;
                Ok(PropertyShape::Text(shape))
            }
            "dropdown" => {
                let shape: DropdownPropertyShape = serde_json::from_str(json)
                    .map_err(|e| format!("Failed to parse dropdown shape: {}", e))?;
                Ok(PropertyShape::Dropdown(shape))
            }
            "checkbox" => {
                let shape: CheckboxPropertyShape = serde_json::from_str(json)
                    .map_err(|e| format!("Failed to parse checkbox shape: {}", e))?;
                Ok(PropertyShape::Checkbox(shape))
            }
            "range" => {
                let shape: RangePropertyShape = serde_json::from_str(json)
                    .map_err(|e| format!("Failed to parse range shape: {}", e))?;
                Ok(PropertyShape::Range(shape))
            }
            "date" => {
                let shape: DatePropertyShape = serde_json::from_str(json)
                    .map_err(|e| format!("Failed to parse date shape: {}", e))?;
                Ok(PropertyShape::Date(shape))
            }
            "compound" => {
                let shape: CompoundPropertyShape = CompoundPropertyShape::from_json(json)?;
                Ok(PropertyShape::Compound(shape))
            }
            _ => Err(format!("Unknown input type: {}", input_type)),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SubTypeSubProperty {
    pub id: String,
    pub name: String,
    pub input_type: String,
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

impl SmartLinkRulesShape {
    pub fn from_json(json: &str) -> Result<Self, String> {
        let shape: SmartLinkRulesShape = serde_json::from_str(json)
            .map_err(|e| format!("Failed to parse SmartLinkRulesShape: {}", e))?;
        Ok(shape)
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

/*-------------------------------------------------------- */
/*--------------------------Subtype------------------------*/
/*-------------------------------------------------------- */

#[derive(Serialize, Deserialize, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SemanticAnchors {
    pub primary: PropertyId,
    pub secondary: PropertyId,
}

/*-------------------------------------------------------- */
/*----------------------Backlink Index---------------------*/
/*-------------------------------------------------------- */

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub enum BacklinkType {
    #[default]
    Direct,
    Compound,
    Indirect,
    Projection,
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
    #[default]
    Lore,
    #[sea_orm(string_value = "person")]
    Person,
    #[sea_orm(string_value = "location")]
    Location,
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
