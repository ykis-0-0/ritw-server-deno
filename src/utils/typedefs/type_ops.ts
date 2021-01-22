export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
// Cond<A | B> ==> Cond<A> | Cond<B>
// `infer T` in fn( :T) is Contra-variant
