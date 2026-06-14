
class Logger {
  entries = [];

  write(level, message, context) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
    this.entries.push(entry);
    const prefix = context ? `[${context}]` : '';
    console.log(`${entry.timestamp} [${level}] ${prefix} ${message}`);
  }

  info(message, context) {
    this.write('INFO', message, context);
  }

  warn(message, context) {
    this.write('WARN', message, context);
  }

  error(message, context) {
    this.write('ERROR', message, context);
  }

  debug(message, context) {
    this.write('DEBUG', message, context);
  }

  step(message, context) {
    this.write('STEP', message, context);
  }

  getEntries() {
    return [...this.entries];
  }

  clear() {
    this.entries.length = 0;
  }
}

export const logger = new Logger();