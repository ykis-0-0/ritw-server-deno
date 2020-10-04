import { BaseHandler } from 'std://log/handlers.ts';
import type { LogRecord } from 'std://log/logger.ts';
import type { LevelName } from 'std://log/levels.ts'

export default class MyConsoleHandler extends BaseHandler {

  constructor(lvl: LevelName, options: object){
    super(lvl, options);
  }

  format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }

  log(msg: string): void {
    console.log(msg);
  }
}