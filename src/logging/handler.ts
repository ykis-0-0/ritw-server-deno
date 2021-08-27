import { BaseHandler } from '::std/log/handlers.ts';
import type { LogRecord } from '::std/log/logger.ts';
import type { LevelName } from '::std/log/levels.ts';

// Mirrors `interface HandlerOptions` from ::std/log/handlers.ts
interface HndlrOpts {
  formatter?: string | ((lR: LogRecord) => string);
}

export default class MyConsoleHandler extends BaseHandler {

  constructor(lvl: LevelName, options: HndlrOpts) {
    super(lvl, options);
  }

  format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }

  // Mirrors `ConsoleHandler$log(:string)` from ::std/log/handlers.ts
  log(msg: string): void {
    console.log(msg);
  }
}
