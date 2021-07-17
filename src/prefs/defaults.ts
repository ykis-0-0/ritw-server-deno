import type { SummarizedDefaultSchema } from '::/utils/typedefs/schemata.ts';
import type { TheSchema } from './schemata.ts';

import { defaults as general } from '::/prefs/general/defaults.ts';
import { defaults as logging } from '::/logging/prefs/defaults.ts';

const defaults: SummarizedDefaultSchema<TheSchema> = {
  general,
  logging,
} as const;

export default defaults;
