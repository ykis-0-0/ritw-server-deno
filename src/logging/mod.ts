import * as log from '::std/log/mod.ts';
import * as path from '::std/path/mod.ts';

import getDateString from '::/utils/dstring_iso.ts';

import MyConsoleHandler from './handler.ts';
import formatter, { LOG_UNIT_PATH } from './formatter.ts';

const storageFlag = 'LOG_WAITING_INIT';

window.sessionStorage.setItem(storageFlag, ''); // value is not important here

export async function init(logRoot: string): Promise<void> {
  if(window.sessionStorage.getItem(storageFlag) === null) throw ReferenceError('Log config already set');
  window.sessionStorage.removeItem(storageFlag);

  const datetime = getDateString(true);
  const logDir = path.join(logRoot, datetime);
  await Deno.mkdir(logDir, { recursive: true });

  const handlers: Required<log.LogConfig>['handlers'] = {
    console: new MyConsoleHandler('DEBUG', {
      formatter: formatter(true)
    }),
    file: new log.handlers.FileHandler('DEBUG', {
      filename: path.join(logDir, 'default.log'),
      mode: 'x',
      formatter: formatter(false)
    }),
    file_http: new log.handlers.FileHandler('DEBUG', {
      filename: path.join(logDir, 'http_server.log'),
      mode: 'x',
      formatter: formatter(false)
    }),
    file_api: new log.handlers.FileHandler('DEBUG', {
      filename: path.join(logDir, 'apis.log'),
      mode: 'x',
      formatter: formatter(false)
    }),
    fatal: new log.handlers.FileHandler('WARNING', {
      filename: path.join(logRoot, 'error.log'),
      mode: 'a',
      formatter: formatter(false)
    })
  };

  const loggers: Required<log.LogConfig>['loggers'] = {
    default: {
      level: 'DEBUG',
      handlers: ['console', 'file', 'fatal']
    },
    http_server: {
      level: 'DEBUG',
      handlers: ['console', 'file_http_server', 'fatal']
    },
    apis: {
      level: 'DEBUG',
      handlers: ['console', 'file_apis', 'fatal']
    }
  };

  const config: log.LogConfig = { handlers, loggers };

  return await log.setup(config);
}

export default function retrieveLogger(name: string, path: string | null = null) : log.Logger{
  if(!(1 in arguments)) return log.getLogger(name);

  return new Proxy(log.getLogger(name), {
    get: function(t: log.Logger, p: string, r) {
      type possibleLevels = Lowercase<Exclude<log.LevelName, 'NOTSET'>>;
      if(!['debug', 'info', 'warning', 'error', 'critical'].includes(p)) return Reflect.get(t, p, r);

      return function(msg: unknown, ...args: unknown[]) {
        Reflect.apply(t[p as possibleLevels], t, [msg, ...args, {[LOG_UNIT_PATH]: path}]);
      }
    }
  })
}
