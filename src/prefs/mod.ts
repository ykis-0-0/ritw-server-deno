// => std
import * as path from 'std://path/mod.ts';

// => local
import type { PrefSchDefault } from './schema.ts';

const defaults: PrefSchDefault = {
  host_dir: path.join(path.basename(path.fromFileUrl(new URL(import.meta.url))), 'server/site'),
  port: 8080
}

import userPrefs from './shared.ts';

const finalPrefs: PrefSchDefault = (Object.assign({}, defaults, userPrefs));