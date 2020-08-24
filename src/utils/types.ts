export type Expand<T>
= T extends infer O
? {
  [K in keyof O]: O[K];
} : never;

export type Recurse<T>
= T extends (this: infer Q, ...args: infer A) => infer R
? (this: Recurse<Q>, ...args: A) => Recurse<R>
: T extends object
  ? T extends infer O
    ? {
      [K in keyof O]: Recurse<O[K]>
    }
    : never
: T;

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
