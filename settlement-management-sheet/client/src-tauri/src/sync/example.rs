// // migrations/mXXX_create_sync_queue.rs
// manager
//     .create_table(
//         Table::create()
//             .table(SyncQueue::Table)
//             .col(ColumnDef::new(SyncQueue::Id).integer().primary_key())
//             .col(ColumnDef::new(SyncQueue::TableName).string().not_null())
//             .col(ColumnDef::new(SyncQueue::RecordId).integer().not_null())
//             .col(ColumnDef::new(SyncQueue::KeyPath).string().not_null()) // e.g., "user.profile.name"
//             .col(ColumnDef::new(SyncQueue::OldValue).text())  // JSON
//             .col(ColumnDef::new(SyncQueue::NewValue).text())  // JSON
//             .col(ColumnDef::new(SyncQueue::Operation).string()) // "update", "insert", "delete"
//             .col(ColumnDef::new(SyncQueue::CreatedAt).integer().not_null())
//             .col(ColumnDef::new(SyncQueue::SyncedAt).integer()) // NULL until synced
//             .col(ColumnDef::new(SyncQueue::Attempts).integer().default(0))
//             .to_owned(),
//     )
//     .await?;

//  Pseudo-code
// async fn sync_batch() -> Result<()> {
//     let pending = get_unsynced_changes().await?;

//     // Group by table for efficiency
//     let batched = pending.group_by(|item| item.table_name);

//     for (table, changes) in batched {
//         match cloud_api.batch_update(table, changes).await {
//             Ok(_) => mark_as_synced(changes).await?,
//             Err(e) => increment_retry_count(changes).await?,
//         }
//     }

//     Ok(())
// }

// 1. Conflict Resolution
// What happens when:

// User edits locally
// Cloud has newer data
// Sync pulls down changes

// You'll need a strategy:

// Last-write-wins (timestamp-based)
// Merge conflicts (keep both, let user choose)
// Operational transforms (complex but powerful)
// 3. Network Flakiness

// Exponential backoff for retries
// Max retry count before flagging for manual review
// Idempotent operations (same sync request can run twice safely)
