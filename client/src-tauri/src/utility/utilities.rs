use chrono::{DateTime as ChronoDateTime, Utc};

pub fn parse_csv_list(s: Option<String>) -> Vec<String> {
    s.unwrap_or_default()
        .split(',')
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string())
        .collect()
}

pub fn parse_datetime(s: &str) -> ChronoDateTime<Utc> {
    ChronoDateTime::parse_from_rfc3339(s)
        .map(|dt| dt.with_timezone(&Utc))
        .unwrap_or_else(|_| Utc::now())
}

pub fn parse_optional_datetime(s: Option<String>) -> Option<ChronoDateTime<Utc>> {
    s.and_then(|d| {
        ChronoDateTime::parse_from_rfc3339(&d)
            .ok()
            .map(|dt| dt.with_timezone(&Utc))
    })
}

pub fn serialize_datetime(dt: &ChronoDateTime<Utc>) -> String {
    dt.to_rfc3339()
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
