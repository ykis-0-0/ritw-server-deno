import * as Ops from './type_ops.ts';

type OptPropNames<O extends object> = {
  [K in keyof O]-?: O extends {[_ in K]-?: O[_]} ? never : K;
}[keyof O];

type OptWithUndef<O extends object, K extends keyof O>
  = O[K] extends undefined
  ? O[K] extends never ? never : undefined
  : Required<O>[K] extends object ? StrictOptional<Required<O>[K]> : Required<O>[K];

// Wrapped union in {_: T} to prevent early merging of branches
type Optionals<O extends object> = Ops.UnionToIntersection<{
  [K in OptPropNames<O>]: {
    _: {[_ in K]: OptWithUndef<O, _>;}
     | {[_ in K]: never;};
  };
}[OptPropNames<O>]>;

type NonOptionals<O extends object>
   = keyof O extends OptPropNames<O>
   ? {_: unknown;} // Used `unknown` to prevent the `{}` from appearing
   : {_: {[K in Exclude<keyof O, OptPropNames<O>>]: O[K] extends object ? StrictOptional<O[K]> : O[K];};};

// Will have error if we don't wrap and index it as a whole, dunno why tho
// Seems we still can't unwrap it in an earlier phase due to some mystic error
// Looks like it's related to the early map and indexing of Optionals<>?
/**
 * Enforces a 'Exact or not Exist' restrictions on Optional entries in Objects.
 * 
 * - Primitives, Symbols Functions, and Arrays(e.g. `T[]`): refuses to apply directly,  
 *     but will return itself if presented as a property within objects
 * - Tuples (e.g. `[A, B?, C?, ...Z[]]`): shall split into  
 *       ([A, ...Z[]] | [A, B, C, ...Z[]])
 * - Objects (e.g. `type obj = {a: A, b?: B, c: {c1: C1, c2: C2?}}`):
 *       {a: A, c: StrictOptional<obj['c']>} & ({b: B} | {b: never})
 */
type StrictOptional<O extends object> = (Optionals<O> & NonOptionals<O>)['_'];

export default StrictOptional;
