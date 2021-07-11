/**
 * Transorm `A | B` to `A & B`, found useful at times.
 * 
 * Notes on how it's working:
 * > `Cond<A | B>` -> `Cond<A> | Cond<B>`\
 * > while `infer T` in `fn(_: T)` is contra-variant
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// Is it still useful?
export type NonEmpty<O extends object> = O extends infer T ? keyof T extends never ? never : T : never;

export type BasicEq<L, R, O> = (() => L) extends (() => R) ? ((() => R) extends (() => L) ? O : never) : never;

/**
 * A Really empty object™
 */
export type ReallyEmptyObject = {
  [K in string | number | symbol]: never;
};

/**
 * Basically the inverse of `Readonly<>`
 */
export type AllWritable<O extends object> = {
  -readonly [K in keyof O]: O[K];
};
