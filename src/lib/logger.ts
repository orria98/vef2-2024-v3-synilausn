export interface ILogger {
  info: (...messages: unknown[]) => void;
  warn: (...messages: unknown[]) => void;
  error: (...messages: unknown[]) => void;
}

export class Logger implements ILogger {
  private silent: boolean;

  constructor(silent = false) {
    this.silent = silent;
  }

  info(...messages: unknown[]) {
    if (this.silent) {
      return;
    }
    console.info(...messages);
  }

  warn(...messages: unknown[]) {
    if (this.silent) {
      return;
    }
    console.warn(...messages);
  }

  error(...messages: unknown[]) {
    if (this.silent) {
      return;
    }
    console.error(...messages);
  }
}

export const logger = new Logger();
