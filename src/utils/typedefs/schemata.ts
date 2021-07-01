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
};