import type { BasicEq } from '::/utils/typedefs/type_ops.ts';
import type { TheSchema } from './schemata.ts';

// user prefernces goes to here
import userPrefs from './config.ts';
// defaults, just leave it alone
import defaults from './defaults.ts';

//#region Debugging Types
/**
 * for debugging use, should be erased by the TypeScript Engine.
 */
type TUserPrefs = typeof userPrefs;

/**
 * for debugging use, should be erased by the TypeScript Engine.
 */
type TDefaults = typeof defaults;
//#endregion

const prefs: BasicEq<keyof typeof userPrefs, keyof typeof defaults, TheSchema> = Object.assign({}, defaults, userPrefs);

export default prefs;