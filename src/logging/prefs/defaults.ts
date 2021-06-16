import type {NoNullableProps, OnlyNullableProps} from '::/utils/typedefs/schemas.ts'
import type LoggingSchema from './schema.ts';

let loggingDefaults: OnlyNullableProps<LoggingSchema> = {
  //logRoot: './logs/',
}
import userPrefs from '::/prefs/logging.ts';


let finalPref: Readonly<LoggingSchema> = Object.assign({}, loggingDefaults, userPrefs);

export default finalPref;