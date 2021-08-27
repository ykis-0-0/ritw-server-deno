import * as Oak from 'Oak/mod.ts';

import getEncodedParams from '::/utils/oak/get_raw_pathvars.ts';
import { controller as abortCtrl } from '::/utils/oak/abort_ctrl.ts';
import { retrieveLogger } from '::/logging/mod.ts';

const router = new Oak.Router();

router.all('/:msg', async (ctx, next) => {
  const ads = {
    method: ctx.request.method,
    msg: ctx.params['msg'],
    query: Oak.helpers.getQuery(ctx),
    fragment: ctx.request.url.hash
  };
  ctx.response.body = JSON.stringify(ads, undefined, 2);
  return await next();
});

router.all('/ex/:msg(.+)', async function self(ctx, next) {
  const paramsEncoded = getEncodedParams(ctx, self);
  const ads = {
    method: ctx.request.method,
    matched: ctx.matched,
    msg: ctx.params['msg'],
    splitted: ctx.params['msg']?.split('/'),
    raw: ctx.request.url.pathname,
    reparsed: paramsEncoded,
    query: Oak.helpers.getQuery(ctx),
    fragment: ctx.request.url.hash
  };
  ctx.response.body = JSON.stringify(ads, undefined, 2);
  return await next();
});

router.all('/ex2/:msg*/end', async (ctx, next) => {
  const ads = {
    method: ctx.request.method,
    msg: ctx.params['msg'],
    query: Oak.helpers.getQuery(ctx),
    fragment: ctx.request.url.hash
  };
  ctx.response.body = JSON.stringify(ads, undefined, 2);
  return await next();
});

router.get('/stop', async (ctx, next) => {

  const baseLogger = await retrieveLogger('http_server', ['/stop']);

  ctx.response.body = 'Stopping Server';

  await next();

  abortCtrl.abort();

  baseLogger.critical('Stop Endpoint Triggered, Server Aborted!');
})

export { router };