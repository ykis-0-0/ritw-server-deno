import * as Oak from 'Oak/mod.ts';

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

router.all('/ex/:msg*', async (ctx, next) => {
  const ads = {
    method: ctx.request.method,
    msg: ctx.params['msg'],
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

import retrieveLogger from '::/logging/mod.ts';
import { controller as abortCtrl } from '::/utils/abort_ctrl.ts';

router.get('/stop', async (ctx, next) => {
  const baseLogger = retrieveLogger('default');

  ctx.response.body = 'Stopping Server';

  await next();

  abortCtrl.abort();

  baseLogger.critical('Stop Endpoint Triggered, Server Aborted!');
})

export { router };