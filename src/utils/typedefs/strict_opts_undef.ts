import StrictOptional from './strict_opts.ts';

type test0 = {a: string, b?: number, c: {c1: number}, d: {d1?: number}, e?: {e1: symbol}, f?: undefined};
type result0 = StrictOptional<test0>;
type test1 = {f?: undefined};
// ! FAILED CASE HERE
type result1 = StrictOptional<test1>;

type prob0 = Required<test1>;
type prob1 = Required<test1>['f'];
type prob2 = Required<test1>['f'] extends object ? 1 : 0;
type prob2a = undefined extends object ? 1 : 0;

type a = never extends undefined ? 1 : 0;
type b = undefined extends never ? 1 : 0;
type c = undefined extends undefined ? 1 : 0;
type d = undefined extends object ? 1 : 0;
type e = never extends object ? 1 : 0;
//type d =  extends  ? 1 : 0;

let inst1: test1 = {f: undefined}
