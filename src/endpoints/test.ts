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

export { router };