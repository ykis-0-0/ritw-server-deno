import type * as path from '::std/path/mod.ts';

// @deno-types='https://github.com/DefinitelyTyped/DefinitelyTyped/raw/master/types/mustache/index.d.ts'
import mustache from 'https://github.com/janl/mustache.js/raw/master/mustache.js';

import type { DispatcherRequest } from '::/server/dispatcher.ts';

class MustacheBuilder {
  constructor(dir: path.ParsedPath){
    // TODO
  }
}

export default (req: DispatcherRequest) => undefined;