pub use sea_orm_migration::prelude::*;

mod m20260113_000002_update_glossary_schema;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260113_000002_update_glossary_schema::Migration),
        ]
    }
}