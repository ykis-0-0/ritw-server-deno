import type * as Schema from '::/prefs/schemata.ts';

const general: Schema.General = {
  serverPort: 80,
};

const logging: Schema.Logging = {
  logRoot: './logs/',
};

const website: Schema.Website = {
  urlRoot: '/',
  serveRoot: '/assets'
}

const configs: Schema.TheSchema = {
  general,
  logging,
  website,
} as const;

export default configs;
