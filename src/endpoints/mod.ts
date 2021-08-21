import * as Oak from 'Oak/mod.ts';

import { router as testRouter } from './test.ts';

const grandRouter = new Oak.Router();

grandRouter.use('/test', testRouter.routes(), testRouter.allowedMethods());

export { grandRouter };