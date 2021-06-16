export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
// Cond<A | B> ==> Cond<A> | Cond<B>
// `infer T` in fn( :T) is Contra-variant

// Does it still useful?
export type NonEmpty<O extends object> = O extends infer T ? keyof T extends never ? never : T : never;

export type BasicEq<L, R, O> = (() => L) extends (() => R) ? ((() => R) extends (() => L) ? O : never) : never;