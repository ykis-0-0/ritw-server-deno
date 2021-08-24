import * as Oak from 'Oak/mod.ts';
import { pathMatch } from 'Oak/deps.ts';

import { retrieveLogger } from '::/logging/mod.ts';

export default async function getEncodedParams(ctx: Oak.RouterContext, caller: Oak.RouterMiddleware){
  if(!ctx.matched?.length){
    // Didn't know why, but type-checking won't pass if we use ctx.throw here
    throw new Oak.httpErrors.InternalServerError('ERROR: No matched route found while one of the endpoints is reached');
  }
  const routes = ctx.matched.filter(_ => _.stack.includes(caller));
  if(!routes?.length)
    ctx.throw(Oak.Status.InternalServerError, 'ERROR: Middleware unable to locate itself in any registered routes');

  const reparsed = routes.map(_ => pathMatch<Record<string, unknown>>(_.path)(ctx.request.url.pathname)).filter((_): _ is Exclude<typeof _, false> => !!_);
  if([...new Set(reparsed)].length > 1){
    const logger = await retrieveLogger('default', ['http_server/getEncodedParams']);
    logger.error('Caller is attached to multiple endpoints:\n\n' + routes.map(_ => '- '.concat(_.path)).join('\n'))

    ctx.throw(Oak.Status.InternalServerError, 'ERROR: Router configuration incorrect');
  };

  return reparsed[0].params;
};