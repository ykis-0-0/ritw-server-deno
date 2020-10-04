type OptionalPropNames<O extends object> = Exclude<{
  [K in keyof O]: O extends Record<K, O[K]> ? never : K;
}[keyof O], undefined>

type UnionToIntersection<U> = (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;

// Wrap union in object to prevent early merging
type OptionalCollection<O extends object> = UnionToIntersection<{
  [K in OptionalPropNames<O>]-?: {
    _: {
      [K2 in K]: Exclude<O[K2] extends object ? StrictOptional<O[K2]> : O[K2], undefined>;
    } | {}
  };
}[OptionalPropNames<O>]>;

// Will have error if we don't index it as a whole, dunno why tho
type StrictOptional<O extends object> = ({_: {
  [K in Exclude<keyof O, OptionalPropNames<O>>]: O[K] extends object ? StrictOptional<O[K]> : O[K];
}} & OptionalCollection<O>)['_'];

export default StrictOptional;