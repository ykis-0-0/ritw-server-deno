import * as Ops from './type_ops.ts';

type AnyCtor<T, A extends unknown[]> = new(...args: A) => T;
type AnyFn<T, A extends unknown[], R> = (this: T, ...args: A) => R;
type AnyCallable = AnyFn<unknown, unknown[], unknown> | AnyCtor<unknown, unknown[]>;
type ExtendsTF<L, R> = (L) extends (R) ? true : false;

/** Check if an array-like is a tuple.
 * 
 * NOT(length is variable AND no position keys <-(wrapped in [] to prevent early resolution to never))
 * 
 * Usage: IsTuple<A> extends true ? *true branch* : *false branch*
 * 
 * Notes: why | is used instead of &
 * ```
 *   true & false === never;
 *   true | false === boolean;
 *   true |  true === true;
 * ```
 */
type IsTuple<A extends unknown[]> = ExtendsTF<number, A['length']> | ExtendsTF<[Exclude<keyof A, keyof []>], [never]> extends true ? false : true;

/*
! disabled due to no appropriate implementation of tuples
TODO Find a way to properly deal with it
type First<O extends unknown[]> = O extends [infer T1f, ...(infer Tr)] ? T1f : never;
type Rest<O extends unknown[]> = O extends [(infer T1f), ...(infer Tr)] | [(infer T1o)?, ...(infer Tr)] ? SOT<Tr> : [];
type SOT<O extends unknown[]> = [...First<O> extends never ? [] : [First<O>], ...Rest<O>]
*/

type PreprocessEntries<O extends object, _ extends keyof O>
  = O[_] extends undefined
    ? O[_] extends never
      ? never
    : undefined
  : Required<O>[_] extends object
    ? StrictOptional<Required<O>[_]>
  : Required<O>[_]
;

type OptPropNames<O extends object> = {
  [K in keyof O]-?: O extends {[_ in K]-?: O[_]} ? never : K;
}[keyof O];

// Wrapped union in {_: T} to prevent early merging of branches
// Key Remapping introduced in TS4.0, but not used due to 
//    -? incorrectly stripping undefined in case {u: undefined}
export type Optionals<O extends object> = Ops.UnionToIntersection<{
  // If type is not optional or undefined, it should not be affected by -?
  // If Key Remapping enabled, becomes
  // [K in keyof O as O extends {[_ in K]-?: O[_]} ? never : K]: {
  [K in OptPropNames<O>]-?: {
    _: {[_ in K]: PreprocessEntries<O, _>;}
     | {[_ in K]: never;};
  };
}[OptPropNames<O>]>;

type NonOptionals<O extends object>
  = keyof O extends OptPropNames<O>
  ? {_: unknown;} // Used `unknown` to prevent `{}` from appearing
  : {_: {[K in Exclude<keyof O, OptPropNames<O>>]: O[K] extends object ? PreprocessEntries<O, K> : O[K];};}
;

// Will have error if we don't wrap and index it as a whole, dunno why tho
// Seems we still can't unwrap it in an earlier phase due to some mystic error
// Looks like it's related to the early map and indexing of Optionals<>?
/**
 * Enforces a 'Exact or not Exist' restrictions on Optional entries in Objects.
 * 
 * - Primitives, Symbols Functions, and Arrays(e.g. `T[]`): refuses to apply directly,  
 *     but will return itself if presented as a property within objects
 * - ***Not Implemented Now*** ~Tuples (e.g. `[A, B?, C?, ...Z[]]`): shall split into~
 *       ([A, ...Z[]] | [A, B, C, ...Z[]])
 * - Objects (e.g. `type obj = {a: A, b?: B, c: {c1: C1, c2: C2?}}`):
 *       {a: A, c: StrictOptional<obj['c']>} & ({b: B} | {b: never})
 */
type StrictOptional<T extends object>
  = T extends AnyCallable // [[Function]] | [[Constructor]]
  ? T
  : T extends unknown[]
    ? IsTuple<T> extends true // (length is variable) & (no positioned keys)
      ? T // Required<T> | NO<T>['_'] // TODO need to find a way to trim optional items first
      : T // treated same as arrays
  : (Optionals<T> & NonOptionals<T>)['_'] // Should be an object now
;

export default StrictOptional;
