import Mustache from 'Mustache';
import * as MustacheTypes from './typedefs.ts';

export const stackPopper = '_stackPop';
const STACKPOP_PATCHED: unique symbol = Symbol(`Invocation of ${stackPopper} inserted by wrapper code`);

type TokenTree = MustacheTypes.TokenTreeNode[]; // type added to avoid exploding code hints
/**
 * Checks for any invocation of the _stackPop function inside the template
 * @private
 * @param tokenTree Token stream generated from Mustache.parse()
 * @throws {ReferenceError} When the reserved name appears in the template source
 */
function checkUsage(tokenTree: TokenTree){
  const treeSpreader = function self(token: MustacheTypes.TokenTreeNode): [type: MustacheTypes.SpanTypes, value: string][] {
    const maybeSubtree = token[4];
    const selfInfo: ReturnType<typeof self>[number] = [token[0], token[1]];
    if(!Array.isArray(maybeSubtree)) return [selfInfo]; // [[type, value], ]
    return [selfInfo, ...maybeSubtree.flatMap(self)];
  };
  const infringments
  = tokenTree
  .flatMap(treeSpreader)
  .filter(token => token[0] !== 'text' && token[1] === stackPopper);
  if(infringments.length) throw new ReferenceError(`Reserved name ${stackPopper} appears in template source`);
}

Deno.test({
  name: 'check token tree',
  fn(): void {
    checkUsage(Mustache.parse(`{{#stackPop}}_stackPop{{/stackPop}}`))
  }
})

export function parse(template: string, tags?: MustacheTypes.Tags) {
  const tokenTree = Mustache.parse(template, tags);

  type LastToken = MustacheTypes.TokenTreeNode & { [STACKPOP_PATCHED]?: true; };
  // type assertion needed since TypeScript don't know the tree should be non-empty
  const [lastToken]: [LastToken] = tokenTree.slice(-1) as [(typeof tokenTree)[number]];
  // Check if the cache entry is already tainted by us
  // if yes then return cache directly
  const isTainted = lastToken?.[STACKPOP_PATCHED] ?? false;
  if(isTainted) return tokenTree;

  checkUsage(tokenTree);

  const patchStart: number = Array.isArray(lastToken[4]) ? <number>lastToken?.[5] : lastToken?.[3];

  const newToken: LastToken = ['name', stackPopper, patchStart, patchStart + stackPopper.length];
  newToken[STACKPOP_PATCHED] = true;
  tokenTree.push(newToken);

  return tokenTree;
}

export function render(template: string, view: MustacheTypes.View , partials?: MustacheTypes.PartialsPool, config?: MustacheTypes.TagsOrRenderOptions) {
  const tags = Array.isArray(config) ? config : config?.tags;

  // ensure template is patched
  parse(template, tags);

  return Mustache.render(template, view, partials, config);
}
