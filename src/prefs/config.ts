import type * as Schema from '::/prefs/schemata.ts';

const general: Schema.General = {
  serverPort: 80,
};

const logging: Schema.Logging = {
  logRoot: './logs/',
};

const configs: Schema.TheSchema = {
  general,
  logging,
} as const;

export default configs;
