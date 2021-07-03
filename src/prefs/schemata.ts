import type { Schema as General } from '::/prefs/general/schema.ts';
import type { Schema as Logging } from '::/logging/prefs/schema.ts';
import type { Schema as Website } from '::/endpoints/website/prefs/schema.ts'

export type TheSchema = Readonly<{
  general: General;
  logging: Logging;
  website: Website;
}>;

export type { Schema as General } from '::/prefs/general/schema.ts';
export type { Schema as Logging } from '::/logging/prefs/schema.ts';
export type { Schema as Website } from '::/endpoints/website/prefs/schema.ts';