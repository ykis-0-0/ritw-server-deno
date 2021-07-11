type PDBase = {
  configurable?: boolean;
  enumerable?: boolean;
}
type PropDescData = {
  writable?: boolean;
  value?: unknown;
  get?: never;
  set?: never;
};

type PropDescAssr = {
  get?: () => unknown;
  set?: (_: any) => void;
  writable?: never;
  value?: never;
};

export type ObjectDefineProperty = {
  <T extends object, K extends PropertyKey, D extends PropDescData>
  (obj: T, key: K, desc: D & PDBase): asserts obj is T
    & ( D extends { value: infer V; }
      ? D extends { writable: true; } ? { [KK in K]: V; } : { readonly [KK in K]: V; }
      : unknown )
    & ( keyof D extends 'get' | 'set' ? never : unknown )
  ;
  <T extends object, K extends PropertyKey, D extends PropDescAssr>
  (obj: T, key: K, desc: D & PDBase): asserts obj is T
    & ( D extends { get: () => infer G; }
      ? D extends { set: (_: infer S) => unknown; } ? { [KK in K]: G; } : { readonly [KK in K]: G; }
      : unknown )
    & ( keyof D extends 'writable' | 'value' ? never : unknown )
  ;
};
