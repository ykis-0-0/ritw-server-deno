import type { Schema as General } from '::/prefs/general/schema.ts';
import type { Schema as Logging } from '::/logging/prefs/schema.ts';

export type TheSchema = {
  general: General;
  logging: Logging;
};

export type { Schema as General } from '::/prefs/general/schema.ts';
export type { Schema as Logging } from '::/logging/prefs/schema.ts';
