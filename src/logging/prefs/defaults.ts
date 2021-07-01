import type { ObjEnsureSomeOrReallyNothing } from '::/utils/typedefs/schemata.ts'
import type { Schema } from './schema.ts';

export const defaults: ObjEnsureSomeOrReallyNothing<Schema> = {
  //logRoot: './logs/',
};
/*
import userPrefs from '::/prefs/logging.ts';


let finalPref: Readonly<LoggingSchema> = Object.assign({}, loggingDefaults, userPrefs);

export default finalPref;
*/