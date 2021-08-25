import * as Oak from 'Oak/mod.ts';

import { router as testRouter } from './test.ts';
import { router as assetsRouter } from './assets.ts';
import { router as siteRouter } from './site.ts';

const grandRouter = new Oak.Router();

grandRouter.use('/test', testRouter.routes()); //, testRouter.allowedMethods());

grandRouter.use('/assets', assetsRouter.routes());

grandRouter.use('/site', siteRouter.routes()); //, siteRouter.allowedMethods());

grandRouter.redirect('/', '/index.html', Oak.Status.PermanentRedirect);
grandRouter.redirect('/index.html', '/site', Oak.Status.TemporaryRedirect);

export { grandRouter };