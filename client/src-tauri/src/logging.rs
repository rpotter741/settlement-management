use std::path::PathBuf;
use tracing_appender::rolling::{RollingFileAppender, Rotation};
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

pub fn setup_logging(log_dir: PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    // Create logs directory if it doesn't exist
    std::fs::create_dir_all(&log_dir)?;

    // Rolling file appender - creates new log file daily, keeps last 7 days
    let file_appender = RollingFileAppender::new(Rotation::DAILY, log_dir, "app.log");

    // Console output for development
    let console_layer = fmt::layer()
        .with_target(false)
        .with_thread_ids(true)
        .with_line_number(true);

    // File output with JSON formatting for easier parsing
    let file_layer = fmt::layer()
        .with_writer(file_appender)
        .with_ansi(false) // No color codes in file
        .json(); // Structured JSON logs

    // Combine layers
    tracing_subscriber::registry()
        .with(console_layer)
        .with(file_layer)
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .init();

    Ok(())
}
