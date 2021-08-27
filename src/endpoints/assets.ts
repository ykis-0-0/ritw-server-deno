import * as Oak from 'Oak/mod.ts';

import getEncodedParams from '::/utils/get_raw_pathvars.ts';
import { roots } from '::/utils/elevator.ts';

const router = new Oak.Router();

router.get('/:path(.+)', async function self(ctx, next) {
  const paramsEncoded = await getEncodedParams(ctx, self, true);
  if(/%2F/i.test(paramsEncoded['path'])) ctx.throw(Oak.Status.BadRequest, `Invalid character in request URL`);

  const sendPromise = Oak.send(ctx, ctx.params['path'] as string, {
    root: roots.assetRoot,
  });

  await sendPromise;
});

export { router };
