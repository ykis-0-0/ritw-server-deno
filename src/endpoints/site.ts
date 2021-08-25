import * as fs from '::std/fs/mod.ts';
import * as path from '::std/path/mod.ts';
import * as hash from '::std/hash/mod.ts';

import * as Oak from 'Oak/mod.ts';
import Mustache from 'Mustache';

import { roots } from '::/utils/elevator.ts';
import getEncodedParams from '::/utils/get_raw_pathvars.ts';
import { retrieveLogger } from '::/logging/mod.ts';

const router = new Oak.Router({strict: true});

const cache: Record<string, {digest: string, parsed: unknown}>  = {};

const validateURL = async (ctx: Oak.RouterContext, caller: Oak.RouterMiddleware) => {
  const paramsEncoded = await getEncodedParams(ctx, caller, true);
  const {dir = '', basename} = paramsEncoded;

  if([dir, basename].some(_ => /%2F/i.test(_))) ctx.throw(Oak.Status.BadRequest, `Invalid character in request URL`);
}

const checkPath = async (ctx: Oak.RouterContext, folder: string, basename: string) => {

  if(!await fs.exists(folder)) ctx.throw(Oak.Status.NotFound, 'The specified path does not exist.');
  if(basename.endsWith('.mustache')) ctx.throw(Oak.Status.Forbidden, '');

  const tester = new RegExp(String.raw `^${basename}(?:\.mustache)?$`, 'i');
  const matches: Deno.DirEntry[] = [];
  for await(const entry of Deno.readDir(folder)) {
    if(entry.isDirectory){
      if(entry.name !== basename) continue;
      matches.push(entry);
      break;
    }

    if(tester.test(entry.name)) matches.push(entry);
  }

  if(!matches.length) ctx.throw(Oak.Status.NotFound, 'The specified path does not exist.');
  if(matches.length > 1) ctx.throw(Oak.Status.VariantAlsoNegotiates, 'More than one page matches the specified URL');

  return matches.shift()!;
}

const retrieveTextContent = async (ctx: Oak.RouterContext, filePath: string) => {
  const filePromise = Deno.readTextFile(filePath);

  try {
    await filePromise;
  } catch(e) {
    const err = e as Error; // Shut the type checker's fucking mouth
    const httpLogger = await retrieveLogger('http_server', ['site']);
    httpLogger.critical(`Error while reading file at ${filePath}: ${err.name in Deno.errors ? 'Deno.errors.' : ''}${err.name}`);
    ctx.throw(Oak.Status.InternalServerError, 'Error while processing server-side rendering');
  }

  return filePromise;
}

router.get('/:dir(.+)?/:basename', async function self(ctx, next) {

  await validateURL(ctx, self);

  const {dir = '', basename} = ctx.params;
  const mappedDir = path.join(roots.pagesRoot, dir);

  const matchedEntry = await checkPath(ctx, mappedDir, basename!);
  if(matchedEntry.isDirectory){
    ctx.response.redirect(ctx.request.url + '/');
    return await next();
  }

  const filePath = path.join(roots.pagesRoot, dir, matchedEntry.name)

  const source = await retrieveTextContent(ctx, filePath);

  Mustache.parse(source);

  let dataRecv = ctx.request.hasBody ? await ctx.request.body({ type: 'json' }).value : {};

  const partialRetriever = await (async function() {
    const httpLogger = await retrieveLogger('http_server', ['site', 'partial_loader']);
    return function(partialName: string) {
      const pathToLook = path.join(mappedDir, partialName.concat('.mustache'));
      if(!fs.existsSync(pathToLook)){
        httpLogger.error(`Partial not found for ${partialName} in ${mappedDir} while fulfilling request for ${matchedEntry.name}`);
        ctx.throw(Oak.Status.InternalServerError, 'Error while processing server-side rendering')
      }
      let partialSource: string = '';
      try {
        partialSource = Deno.readTextFileSync(pathToLook);
      } catch(e) {
        const err = e as Error; // Shut the type checker's fucking mouth
        httpLogger.critical(`Error while reading file at ${filePath}: ${err.name in Deno.errors ? 'Deno.errors.' : ''}${err.name}`);
        ctx.throw(Oak.Status.InternalServerError, 'Error while processing server-side rendering');
      }
      return partialSource;
    }
  })();

  ctx.response.body = Mustache.render(source, {
    query: Object.fromEntries(ctx.request.url.searchParams.entries()),
    post: dataRecv
  }, partialRetriever);

  return await next();
});

router.get('/:dirs+/', async function self(ctx, next) {
  ctx.response.status = Oak.Status.SeeOther;
  // Rename Index page here
  ctx.response.redirect(ctx.request.url + 'index.html');
  return await next();
})

// And here for site root
router.redirect('/', '/index', Oak.Status.PermanentRedirect);

export { router };