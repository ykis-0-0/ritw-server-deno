import * as userPrefs from './config.ts';
import * as defaults from './defaults.ts';
import type * as types from './schemata.ts';

import { BasicEq } from '::/utils/typedefs/type_ops.ts';

type test = BasicEq<keyof typeof userPrefs, keyof typeof defaults, 3>;
