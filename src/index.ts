debugger;
// => std
import * as http from 'std://http/mod.ts';

// => 3rd Party
//// @deno-types='https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/mustache/index.d.ts'
//import * as mustache from 'https://github.com/janl/mustache.js/raw/master/mustache.mjs';

// => local
import registerLogger from '::/logging/mod.ts';
import dispatchRoot from './server/mod.ts';
import './shared.ts'

const server = http.serve({ port: 80 });

import type { Logger } from 'std://log/logger.ts';
const logHttp: Logger = registerLogger('http_server');

let cnt: number = 10;

const defLog: Logger = registerLogger('default');
/*
defLog.debug('debug');
defLog.info('info');
defLog.warning('warning');
defLog.error('error');
defLog.critical('critical');
*/

for await(const req of server) {
  let res: http.Response | undefined = dispatchRoot.handle(req);
  if(res === undefined) throw new ReferenceError('Final fallback from dispatcher not working');
  req.respond(res);
}
logHttp.critical('Server shutting down');
server.close();
Deno.exit();