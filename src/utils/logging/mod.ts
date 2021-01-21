import * as log from 'std://log/mod.ts';

import getDateString from '../dstring_iso.ts';
import MyConsoleHandler from './handler.ts';
import formatter from './formatter.ts';

let date: string = getDateString(true);

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
      filename: './error.log',
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
}

await Deno.mkdir(`./logs/${date}`, {recursive: true});

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
        Reflect.apply(t[p as 'debug' | 'info' | 'warning' | 'error' | 'critical'], t, [msg, path].concat(args));
      }
    }
  })
}
