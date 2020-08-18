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