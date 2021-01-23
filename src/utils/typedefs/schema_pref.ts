import type StrictOptional from './strict_opts.ts';
import { NonEmpty } from './type_ops.ts';
import type * as T from './itelli_expand.ts';

type PrefSchema = {
  host_dir: string;
  files_dir?: [string, ...string[]];
  port: number;
};

export type PrefSchDefault = T.Expand<StrictOptional<PrefSchema>>;

export type PrefSchUser = T.Expand<NonEmpty<StrictOptional<Partial<PrefSchema>>>> | { [K in any]: never;}