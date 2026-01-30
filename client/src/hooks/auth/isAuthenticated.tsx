import { Navigate } from 'react-router-dom';

const useProtectedRoute = () => {
  const authenticated = localStorage.getItem('token');
  //@ts-ignore
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true';

  // if (skipAuth) {
  //   console.log('Auth is skipped based on environment settings.');
  //   return true;
  // }

  const goToLogin = () => <Navigate to="/login" />;

  return { authenticated: true, goToLogin };
};

export default useProtectedRoute;

/*
{
  "user": {
    "id": "u_123",
    "tier": "Pro_Annual",
    "credits_balance": 15
  },
  "capabilities": {
    "can_sync": true,
    "can_sell": true,
    "market_access": "unlimited" // vs "expires_in_30_days"
  }
}

const { capabilities } = useAuth();

// Gating the Sync Toggle
{capabilities.can_sync_cloud ? <SyncToggle /> : <UpgradeToBasic />}

// Gating the "Publish for Sale" button
{capabilities.can_sell_docs && <PublishForSaleButton />}

*/

/* app_state table

Column,Type,Why?
device_id,TEXT (UUID),"Generated on first launch. The ""owner"" of all offline work."
current_user_id,TEXT (NULL),Populated only when they log in/subscribe.
access_token,TEXT,The JWT for the marketplace (to avoid re-logging in every time).
capabilities_json,TEXT,"A cached JSON string of what they can do (e.g., {""can_sync"": true})."


*/

/* documents table (all my other shit) yeah right lol

*/

/* entitlements table
Column,Type,Why?
type,TEXT,"MARKET_PASS, BASIC_SUB, or PRO_SUB."
expires_at,DATETIME,When the access shuts off.
is_active,BOOLEAN,A quick flag to check.
granted_at,DATETIME,When they bought it.
*/

/*

#[async_trait]
pub trait Syncable {
    // What is the unique ID for this record?
    fn get_id(&self) -> String;

    // What is the last time this was changed?
    fn get_updated_at(&self) -> NaiveDateTime;

    // Convert this struct into a JSON blob for the server
    fn to_sync_payload(&self) -> serde_json::Value;

    // Logic to decide: Do I overwrite my local copy or push to server?
    async fn resolve_conflict(&self, server_version: serde_json::Value) -> bool {
        // Default logic: "Last Writer Wins"
        true
    }
}

#[async_trait]
impl Syncable for GlossaryEntry {
    fn get_id(&self) -> String { self.id.clone() }
    fn get_updated_at(&self) -> NaiveDateTime { self.updated_at }
    fn to_sync_payload(&self) -> serde_json::Value {
        serde_json::to_value(self).unwrap()
    }
}

Column,Type,Description
id,UUID,Primary Key for this fork event.
source_id,UUID,The original Doc ID.
fork_id,UUID,The new Doc ID created by the fork.
user_id,TEXT,Who did the forking?


pub struct EntityRegistry {
    pub id: String,          // The UUID used across the app
    pub entity_type: String, // "Glossary", "Entry", "SubType"
    pub sync_hash: String,   // To check if the cloud version matches
    pub last_synced_at: Option<DateTime>,
}

*/

/*

-- Core auth/user stuff
users (
  id uuid primary key,
  email text unique not null,
  created_at timestamp,
  updated_at timestamp
)

user_tiers (
  id uuid primary key,
  user_id uuid references users,
  tier_type text, -- 'free' | 'market_pass' | 'premium'
  expires_at timestamp nullable,
  created_at timestamp
)

devices (
  id uuid primary key,
  user_id uuid references users nullable, -- null before auth
  device_uuid uuid unique not null,
  last_seen timestamp,
  created_at timestamp
)

user_settings (
  user_id uuid primary key references users,
  settings jsonb,
  version int default 1,
  updated_at timestamp
)

-- Content ownership & forking
narratives (
  id uuid primary key,
  title text,
  author_id uuid references users,
  parent_narrative_id uuid references narratives nullable, -- for forks
  is_paid boolean default false,
  price_cents int nullable,
  created_at timestamp,
  updated_at timestamp
)

-- Fork history tracking
narrative_forks (
  id uuid primary key,
  source_narrative_id uuid references narratives,
  forked_narrative_id uuid references narratives,
  forked_by uuid references users,
  forked_at timestamp
)

-- System vs user content split
system_subtypes (
  id uuid primary key,
  name text not null,
  schema jsonb not null,
  version int default 1, -- for updates you push
  created_at timestamp,
  updated_at timestamp
)

user_subtypes (
  id uuid primary key,
  name text not null,
  author_id uuid references users,
  parent_subtype_id uuid references user_subtypes nullable, -- for forks
  schema jsonb not null,
  is_paid boolean default false,
  created_at timestamp,
  updated_at timestamp
)

-- Same pattern for properties
system_properties (
  id uuid primary key,
  name text not null,
  config jsonb not null,
  version int default 1,
  created_at timestamp,
  updated_at timestamp
)

user_properties (
  id uuid primary key,
  name text not null,
  author_id uuid references users,
  parent_property_id uuid references user_properties nullable,
  config jsonb not null,
  is_paid boolean default false,
  created_at timestamp,
  updated_at timestamp
)

-- Snapshot dependencies (what got installed with what)
narrative_dependencies (
  id uuid primary key,
  narrative_id uuid references narratives,
  dependency_type text, -- 'subtype' | 'property' | 'entry'
  dependency_id uuid, -- polymorphic ref
  is_system boolean, -- true = system table, false = user table
  snapshot_data jsonb, -- the actual content at install time
  created_at timestamp
)

// On successful login:
// 1. Generate long-lived refresh token (30+ days)
// 2. Store in OS keychain (Tauri has keytar plugin)
// 3. Use refresh token to get short-lived access tokens (1 hour)

use tauri_plugin_keyring::Keyring;

#[tauri::command]
async fn store_auth_token(service: &str, username: &str, token: &str) -> Result<(), String> {
    let keyring = Keyring::new(service, username);
    keyring.set_password(token)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_auth_token(service: &str, username: &str) -> Result<String, String> {
    let keyring = Keyring::new(service, username);
    keyring.get_password()
        .map_err(|e| e.to_string())
}

*/
