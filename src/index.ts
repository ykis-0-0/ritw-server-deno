debugger;

//#region Initialization and Permissions Acquisition
// We need to be running as the Main module.
if(!import.meta.main) throw new EvalError('This is intended to be loaded as main module.');

import { elevate, roots } from '::/utils/elevator.ts';

console.info('Acquiring permissions, please check if the descriptors match.');
await elevate(import.meta.url);
//#endregion Init & Perms Acq.

import retrieveLogger, { init as loggerInit } from '::/logging/mod.ts';
await loggerInit(roots.logRoot);
const baseLogger = retrieveLogger('default');

/*
baseLogger.debug('debug');
baseLogger.info('info');
baseLogger.warning('warning');
baseLogger.error('error');
baseLogger.critical('critical');
*/
baseLogger.debug('All Folder Permissions Acquired, Logger initialized.');

import * as Oak from 'Oak/mod.ts';

import { grandRouter } from './endpoints/mod.ts';

const app = new Oak.Application({
  serverConstructor: Oak.HttpServerNative,
});

import { signal as abortSignal } from '::/utils/abort_ctrl.ts';

app.use(grandRouter.routes());
app.use(grandRouter.allowedMethods());

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