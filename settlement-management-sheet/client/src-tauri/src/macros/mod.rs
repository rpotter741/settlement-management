#[macro_export]
macro_rules! set_if_some {
    ($active_model: expr, $field:ident, $value: expr) => {
        if let Some(val) = $value {
            $active_model.$field = Set(val);
        }
    };
}

#[macro_export]
macro_rules! some_set_if_some {
    ($active_model: expr, $field:ident, $value: expr) => {
        if let Some(val) = $value {
            $active_model.$field = Set(Some(val));
        }
    };
}

#[macro_export]
macro_rules! set_json_if_some {
    ($active:expr, $field:ident, $value:expr) => {
        if let Some(val) = $value {
            $active.$field =
                ::sea_orm::Set(serde_json::to_string(&val).map_err(|e| e.to_string())?);
        }
    };
}

#[macro_export]
macro_rules! some_set_json_if_some {
    ($active:expr, $field:ident, $value:expr) => {
        if let Some(val) = $value {
            $active.$field = ::sea_orm::Set(Some(
                serde_json::to_string(&val).map_err(|e| e.to_string())?,
            ));
        }
    };
}

#[macro_export]
macro_rules! impl_parse_json {
    ($model:ty, $($field:ident),+) => {
        $(
            impl $model {
                paste::paste! {
                    #[allow(dead_code)]
                    pub fn [<parse_ $field>]<T: serde::de::DeserializeOwned>(&self) -> Result<Option<T>, serde_json::Error> {
                        match &self.$field {
                            Some(json) => serde_json::from_str(json).map(Some),
                            None => Ok(None),
                        }
                    }
                }
            }
        )+
    };
}

#[macro_export]
macro_rules! impl_metadata_try_from {
    ($model_type:ty) => {
        impl TryFrom<$model_type> for ContentMetaData {
            type Error = String;

            fn try_from(model: $model_type) -> Result<Self, Self::Error> {
                Ok(ContentMetaData {
                    id: model.id,
                    ref_id: model.ref_id,
                    version: model.version,
                    published_at: $crate::utility::parse_optional_datetime(model.published_at),
                    download_count: model.download_count,
                    fork_count: model.fork_count,
                    forked_from: model.forked_from,
                    forked_by: $crate::utility::parse_csv_list(model.forked_by),
                    deleted_at: $crate::utility::parse_optional_datetime(model.deleted_at),
                    status: model.status,
                })
            }
        }
    };
}
