use chrono::{DateTime as ChronoDateTime, Utc};
use serde::{Deserialize, Serialize};

/*-------------------------------------------------------- */
/*-------------------------Glossary------------------------*/
/*-------------------------------------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: UserRole,
    pub created_at: ChronoDateTime<Utc>,
    pub updated_at: ChronoDateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub enum UserRole {
    Admin,
    Moderator,
    #[default]
    User,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub enum UserTier {
    #[default]
    Free,
    Pilgrim,
    Eclorean,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UserTiers {
    pub id: String,
    pub user_id: String,
    pub tier: UserTier,
    pub started_at: ChronoDateTime<Utc>,
    pub ended_at: Option<ChronoDateTime<Utc>>,
    pub expires_at: Option<ChronoDateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Devices {
    pub id: String,
    pub user_id: Option<String>,
    pub device_uuid: String,
    pub last_seen: ChronoDateTime<Utc>,
    pub created_at: ChronoDateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct UserSettings {
    pub id: String,
    pub user_id: String,
    pub settings: String, // JSON string for iteration, baby! parse on the front end
    pub updated_at: ChronoDateTime<Utc>,
    pub version: i32,
}
