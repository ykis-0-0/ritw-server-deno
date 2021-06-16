import type {NoNullableProps, OnlyNullableProps} from '::/utils/typedefs/schemas.ts'
import type GeneralSchema from './schema.ts';

let generalDefaults: OnlyNullableProps<GeneralSchema> = {
  //serverPort: 80,
}

import userPrefs from '::/prefs_exts/general.ts';

let finalPref: Readonly<GeneralSchema> = Object.assign({}, generalDefaults, userPrefs);

export default finalPref;