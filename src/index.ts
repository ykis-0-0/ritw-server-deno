// => std
import * as http from '$deno_std/http/mod.ts';

// => 3rd Party
//// @deno-types='https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/mustache/index.d.ts'
//import * as mustache from 'https://github.com/janl/mustache.js/raw/master/mustache.mjs';

// => local
import registerLogger from './utils/logging/mod.ts';
import handle from './server/mod.ts';
const server = http.serve({ port: 80 });

import {Logger} from '$deno_std/log/logger.ts';
const logHttp: Logger = registerLogger('http_server');

let cnt: number = 3;

const defLog: Logger = registerLogger('default');
defLog.debug('debug');
defLog.info('info');
defLog.warning('warning');
defLog.error('error');
defLog.critical('critical');

for await(const req of server) {
  logHttp.info(`GET ${req.url}`);
  if(!cnt--) server.close();
}