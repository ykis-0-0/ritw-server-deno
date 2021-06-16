import type { NoNullableProps, OnlyNullableProps } from '::/utils/typedefs/schemas.ts'
import type { Schema } from './schema.ts';

export const defaults: OnlyNullableProps<Schema> = {
  //logRoot: './logs/',
}
/*
import userPrefs from '::/prefs/logging.ts';


let finalPref: Readonly<LoggingSchema> = Object.assign({}, loggingDefaults, userPrefs);

export default finalPref;
*/