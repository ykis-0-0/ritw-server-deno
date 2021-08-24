import * as Oak from 'Oak/mod.ts';

import { router as testRouter } from './test.ts';
import { router as assetsRouter } from './assets.ts';

const grandRouter = new Oak.Router();

grandRouter.use('/test', testRouter.routes()); //, testRouter.allowedMethods());

grandRouter.use('/assets', assetsRouter.routes());

export { grandRouter };