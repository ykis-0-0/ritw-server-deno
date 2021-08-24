import * as Oak from 'Oak/mod.ts';

import getEncodedParams from '::/utils/get_raw_pathvars.ts';
import { roots } from '::/utils/elevator.ts';

const router = new Oak.Router();

router.get('/:path(.+)', async function self(ctx, next) {
  const paramsEncoded = await getEncodedParams(ctx, self);
  await Oak.send(ctx, paramsEncoded['path'] as string, {
    root: roots.assetRoot,
  })
});

export { router };