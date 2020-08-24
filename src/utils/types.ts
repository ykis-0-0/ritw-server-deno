export type ByFnSignature<A extends any[], R, O extends object>
= {
  [Ko in BfsList<A, R, O>]: O[Ko]
}

type BfsList<A extends any[], R, O extends object>
= {
  [Ko in keyof O]: BfsFilter<A, R, O, Ko>;
}[keyof O];

type BfsFilter<A extends any[], R, O extends object, K extends keyof O>
= O[K] extends ((...args: infer Fa) => infer Fr)
? Fa extends A ? Fr extends R
  ? K
  : never : never
: K;
