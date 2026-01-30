use sea_orm::{DatabaseConnection, DbBackend, FromQueryResult, Statement};
use serde::{Deserialize, Serialize};

#[derive(FromQueryResult, Deserialize, Serialize)]
pub struct SearchResult {
    pub id: String,
    pub name: String,
    pub entry_type: String,
    pub rank: f64,
}

#[tauri::command]
pub async fn search_fts(
    db: tauri::State<'_, DatabaseConnection>,
    query: String,
) -> Result<Vec<SearchResult>, String> {
    let sql = r#"
        SELECT
            e.id,
            e.name,
            e.entry_type,
            bm25(fts) as rank
        FROM "UserGlossaryEntryFTS" fts
        JOIN "UserGlossaryEntry" e ON fts.id = e.id
        WHERE fts MATCH ?
        ORDER BY rank
        LIMIT 50
    "#;

    SearchResult::find_by_statement(Statement::from_sql_and_values(
        DbBackend::Sqlite,
        sql,
        [query.into()],
    ))
    .all(db.inner())
    .await
    .map_err(|e| e.to_string())
}
