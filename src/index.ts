debugger;

//#region Initialization and Permissions Acquisition
// We need to be running as the Main module.
if(!import.meta.main) throw new EvalError('This is intended to be loaded as main module.');

// => std.path for canonicalizing code paths
import * as path from '::std/path/mod.ts';

//! Configuration of directories
console.info('Acquiring access for directories, please check if the location matches.');
const srcRoot = path.dirname(path.fromFileUrl(import.meta.url)); // Deno.mainModule will need permissions, which we don't want to ask for
const logRoot = path.join(srcRoot, '..', 'logs/');
const pagesRoot = path.join(srcRoot, '..', 'pages/');
const assetRoot = path.join(srcRoot, '..', 'assets/');

const questions: { permDesc: Deno.PermissionDescriptor; reason?: string;}[] = [
  { permDesc: { name: 'write', path: logRoot }, reason: 'log storage'},
  { permDesc: { name: 'read', path: pagesRoot }, reason: 'site pages'},
  { permDesc: { name: 'read', path: assetRoot }, reason: 'static assets'},
  { permDesc: { name: 'net'}, reason: 'hosting the server'},
];
for (const el of questions){
  console.info(`${el.permDesc.name.toUpperCase()} access${'path' in el.permDesc ? ` at ${el.permDesc.path}` : ''} is required${'reason' in el ? ` for ${el.reason}` : ''}.`);
  const permStatus = await Deno.permissions.request(el.permDesc);
  if(permStatus.state === 'granted') continue;

  console.error('Access is denied, exiting.');
  Deno.exit(1);
}
//#endregion Init & Perms Acq.

import retrieveLogger, { init as loggerInit } from '::/logging/mod.ts';
await loggerInit(logRoot);
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

const app = new Oak.Application();

app.use(grandRouter.routes());
app.use(grandRouter.allowedMethods());

//! Port settings
const serveOptions: Oak.ListenOptions = {
  port: 8080,
  //todo signal: ??
}
const servePromise = app.listen(serveOptions);

baseLogger.info(`Server started at port ${ serveOptions.port }.`);

await servePromise;
