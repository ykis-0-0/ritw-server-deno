export type Expand<O extends object> = O extends infer T ? {
  [K in keyof T]: T[K]
} : never;

export type RecurseExp<O extends object> = O extends infer T ? {
  [K in keyof T]: T[K] extends object ? RecurseExp<T[K]> : T[K];
} : never;

export let expand_id: <T>(_: T) => T extends object ? Expand<T> : T = (_: any) => _;