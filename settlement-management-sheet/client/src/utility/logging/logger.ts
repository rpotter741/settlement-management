import { invoke } from '@tauri-apps/api/core';

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private async log(level: LogLevel, message: string, context?: LogContext) {
    // Always log to console in dev
    if (import.meta.env.DEV) {
      console[level](message, context);
    }

    // Send to backend for file logging
    try {
      await invoke('log_frontend_error', {
        level,
        message,
        context: context ? JSON.stringify(context, null, 2) : undefined,
      });
    } catch (e) {
      // If logging fails, at least show in console
      console.error('Failed to log to backend:', e);
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  // Special method for catching errors with stack traces
  captureError(error: Error, context?: LogContext) {
    this.error(error.message, {
      ...context,
      stack: error.stack,
      name: error.name,
    });
  }
}

export const logger = new Logger();
