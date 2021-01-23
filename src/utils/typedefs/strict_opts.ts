import * as Ops from './type_ops.ts';

type OptPropNames<O extends object> = Exclude<{
  [K in keyof O]: O extends Record<K, O[K]> ? never : K;
}[keyof O], undefined>

// Wrapped union in {_: T} to prevent early merging of branches
type Optionals<O extends object> = Ops.UnionToIntersection<{
  [K in OptPropNames<O>]-?: {
    _: {
      [_ in K]: Exclude<O[_] extends object ? StrictOptional<O[_]> : O[_], undefined>;
    } | {}
  };
}[OptPropNames<O>]>;

// Will have error if we don't index it as a whole, dunno why tho
type StrictOptional<O extends object> = ({_: {
  [K in Exclude<keyof O, OptPropNames<O>>]: O[K] extends object ? StrictOptional<O[K]> : O[K];
}} & Optionals<O>)['_'];

export default StrictOptional;