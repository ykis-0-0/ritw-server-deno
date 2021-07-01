import type * as Op from './type_ops.ts';

/**
 * > Maybe of use, leaving it here first
 * 
 * Strip properties with type `<T> (null | T)`
 */
export type NoNullableProps<O extends object> = {
  [K in keyof O as (null extends O[K] ? never : K)]: O[K];
};

/**
 * > Maybe of use, leaving it here first
 * 
 * Strip properties without type `<T> (null | T)`, complement of `NoNullableProps<T>`
 */
export type OnlyNullableProps<O extends object> = {
  [K in keyof O as (null extends O[K] ? K : never)]: O[K];
  //[K in keyof O]: null extends O[K] ? K : never;
};

/**
 * > Maybe of use, leaving it here first
 * 
 * There are times we don't want *any* thing to be inside, do we?
 */
export type ObjEnsureSomeOrReallyNothing<O extends object> = keyof OnlyNullableProps<O> extends never ? Op.ReallyEmptyObject : OnlyNullableProps<O>;

/**
 * > Maybe of use, leaving it here first
 * 
 * `OnlyNullableProps<>`, but for the entries
 */
export type SummarizedDefaultSchema<O extends object> = {
  [K in keyof O]: O[K] extends object ? ObjEnsureSomeOrReallyNothing<O[K]> : O[K];
}
