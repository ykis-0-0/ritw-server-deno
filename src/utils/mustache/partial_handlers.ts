import * as fs from '::std/fs/mod.ts';
import * as path from '::std/path/mod.ts';

import * as Oak from 'Oak/mod.ts';

import { roots } from '::/utils/elevator.ts';
import { retrieveLogger } from '::/logging/mod.ts';
import type { Awaited } from '::/utils/typedefs/promises.ts';

type gPRArgs = [
  env: {
    logger: Awaited<ReturnType<typeof retrieveLogger>>,
    ctx: Oak.RouterContext,
  },
  initiator:{
    pageDir: string,
    pageName: string
  },
  stack: string[]
]

function getPartialRetriever(...[{logger, ctx}, {pageDir, pageName}, stack]: gPRArgs) {
    return function(partialName: string){
      // TODO separate for hidden partials
      const [searchBase] = partialName.startsWith('/') ? [roots.pagesRoot] : stack.slice(-1);
      const pathToLook = path.join(searchBase, partialName.concat('.mustache'));

      if(!fs.existsSync(pathToLook)) {
        const errMsg
        = `Partial not found for ${partialName}\n`
        + `when fulfilling request for ${pageName}\n`
        + `with searching directory set at ${pageDir}`;
        logger.error(errMsg);
        ctx.throw(Oak.Status.InternalServerError, 'Error while processing server-side rendering');
      }

      let partialSource: string = '';
      try {
        partialSource = Deno.readTextFileSync(pathToLook);
      } catch(e) {
        const err = e as Error; // Shut the type checker's fucking mouth
        logger.critical(`Error while reading file at ${pathToLook}: ${err.name in Deno.errors ? 'Deno.errors.' : ''}${err.name}`);
        ctx.throw(Oak.Status.InternalServerError, 'Error while processing server-side rendering');
      }

      stack.push(path.dirname(pathToLook));

      return partialSource;
  }
}

export default async function getPartialHandlers(ctx: Oak.RouterContext, pageDir: string, pageName: string) {
  const httpLogger = await retrieveLogger('http_server', ['site', 'partial_loader']);
  const stack = [pageDir];

  return {
    resolvePartial: getPartialRetriever({logger: httpLogger, ctx}, {pageDir, pageName}, stack),
    unwindStack: () => void stack.pop()
  };
}
