debugger;
import * as Oak from 'Oak/mod.ts';

import { elevate, roots } from '::/utils/elevator.ts';
import { init as loggerInit, retrieveLogger } from '::/logging/mod.ts';
import { signal as abortSignal } from '::/utils/abort_ctrl.ts';
import { grandRouter } from '::/endpoints/mod.ts';

// We need to be running as the Main module.
if(!import.meta.main) throw new EvalError('This is intended to be loaded as main module.');

console.info('Acquiring permissions, please check if the descriptors match.');
await elevate(import.meta.url);

await loggerInit(roots.logRoot);
const baseLogger = await retrieveLogger('default');

/*
baseLogger.debug('debug');
baseLogger.info('info');
baseLogger.warning('warning');
baseLogger.error('error');
baseLogger.critical('critical');
*/
baseLogger.debug('All Folder Permissions Acquired, Logger initialized.');

const app = new Oak.Application({
  serverConstructor: Oak.HttpServerNative,
});


app.use(grandRouter.routes());
app.use(grandRouter.allowedMethods());

app.addEventListener('listen', async () => {
  const httpLogger = await retrieveLogger('http_server', ['main']);
  httpLogger.debug('Endpoints registered:\n' + [...grandRouter.values()].map(_ => '  '.concat(_.path)).join('\n'));
})

//! Port settings
const serveOptions: Oak.ListenOptions = {
  port: 8080,
  signal: abortSignal,
}
const servePromise = app.listen(serveOptions);
baseLogger.info(`Server started at port ${ serveOptions.port }.`);
await servePromise;

baseLogger.info('Server stopped. Exiting.');
Deno.exit();