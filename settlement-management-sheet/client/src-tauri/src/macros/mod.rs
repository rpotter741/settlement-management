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
