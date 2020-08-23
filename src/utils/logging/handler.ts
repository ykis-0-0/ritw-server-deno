import { BaseHandler } from '$deno_std/log/handlers.ts';
import { LogRecord } from '$deno_std/log/logger.ts';
import { LevelName } from '$deno_std/log/levels.ts'

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