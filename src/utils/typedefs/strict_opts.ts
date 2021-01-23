import * as Ops from './type_ops.ts';

type OptPropNames<O extends object> = {
  [K in keyof O]-?: O extends {[_ in K]-?: O[_]} ? never : K;
}[keyof O];

// Wrapped union in {_: T} to prevent early merging of branches
type Optionals<O extends object> = Ops.UnionToIntersection<{
  [K in OptPropNames<O>]: {
    _: {[_ in K]: Required<O>[_] extends object ? StrictOptional<Required<O>[_]> : Required<O>[_];}
     | {}
  };
}[OptPropNames<O>]>;

type NonOptionals<O extends object> = {
  _: {
    [K in Exclude<keyof O, OptPropNames<O>>]: O[K] extends object ? StrictOptional<O[K]> : O[K];
  };
};

// Will have error if we don't index it as a whole, dunno why tho
type StrictOptional<O extends object> = (NonOptionals<O> & Optionals<O>)['_'];

export default StrictOptional;