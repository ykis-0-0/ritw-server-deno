import type StrictOptional from '::/utils/typedefs/strict_opts.ts';

type PrefSchema = {
  host_dir: string;
  files_dir?: [string, ...string[]];
  port: number;
};

export type PrefSchDefault = StrictOptional<PrefSchema>;

export type PrefSchUser = StrictOptional<PrefSchema> | { [K in any]: never;}
