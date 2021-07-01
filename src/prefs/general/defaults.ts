import type { NoNullableProps, OnlyNullableProps } from '::/utils/typedefs/schemata.ts'
import type { Schema } from './schema.ts';

export const defaults: OnlyNullableProps<Schema> = {
  //serverPort: 80,
}
/*
import userPrefs from '::/prefs_exts/general.ts';

let finalPref: Readonly<GeneralSchema> = Object.assign({}, defaults, userPrefs);

export default finalPref;
*/