use sea_orm::DatabaseConnection;
use std::collections::HashMap;


#[derive(Clone)]
pub struct FullSubTypeData {
  pub id: String,
  pub groups:HashMap<String, GroupWithProperties>,
}

pub struct GroupWithProperties {
  pub id: String,
  pub name: String,
  pub properties: HashMap<String, SubTypeProperty>,
}


pub async fn get_sub_type_full_data(
  db: &DatabaseConnection,
  id: &String,
) -> Result<FullSubTypeData, String>{

}