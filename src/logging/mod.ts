import * as log from '::std/log/mod.ts';
import * as path from '::std/path/mod.ts';

import getDateString from '::/utils/dstring_iso.ts';
import theAnchor from '::/utils/anchor.ts';
import prefs from '::/prefs/mod.ts';

import type { Schema as LoggingPrefs } from './prefs/schema.ts';

import MyConsoleHandler from './handler.ts';
import formatter, { LOG_UNIT_PATH } from './formatter.ts';

const loggingPrefs: LoggingPrefs = prefs.logging;

const absLogDir = theAnchor.rebase(loggingPrefs.logRoot);
await Deno.permissions.request({name: 'write', path: absLogDir});

let date: string = getDateString(true);

let logDir: string = `${absLogDir}/${date}`;

await Deno.mkdir(logDir, {recursive: true});

let config: log.LogConfig = {
  handlers: {
    console: new MyConsoleHandler('DEBUG', {
      formatter: formatter(true)
    }),
    file: new log.handlers.FileHandler('DEBUG', {
      filename: `./logs/${date}/default.log`,
      mode: 'x',
      formatter: formatter(false)
    }),
    file_http: new log.handlers.FileHandler('DEBUG', {
      filename: `./logs/${date}/http_server.log`,
      mode: 'x',
      formatter: formatter(false)
    }),
    file_api: new log.handlers.FileHandler('DEBUG', {
      filename: `./logs/${date}/apis.log`,
      mode: 'x',
      formatter: formatter(false)
    }),
    fatal: new log.handlers.FileHandler('WARNING', {
      filename: './logs/error.log',
      mode: 'a',
      formatter: formatter(false)
    })
  },
  loggers: {
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
    },
    console: {
      level: 'DEBUG',
      handlers: ['console']
    },
    file: {
      level: 'DEBUG',
      handlers: ['file']
    }
  }
};

await log.setup(config);

export default function register(name: string, path: string | null = null) : log.Logger{
  if(!(1 in arguments)) {
    return log.getLogger(name);
  }
  return new Proxy(log.getLogger(name), {
    get: function(t: log.Logger, p: string, r) {
      if(!['debug', 'info', 'warning', 'error', 'critical'].includes(p)) {
        return Reflect.get(t, p, r);
      }
      return function(msg: unknown, ...args: unknown[]) {
        Reflect.apply(t[p as 'debug' | 'info' | 'warning' | 'error' | 'critical'], t, [msg, ...args, {[LOG_UNIT_PATH]: path}]);
      }
    }
  })
}
