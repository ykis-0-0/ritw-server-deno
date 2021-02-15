import StrictOptional from './strict_opts.ts';

type t00 = number[];
type t01 = [number];
type t02 = [number, string?];
type t03 = [number, string?, boolean?];
type t04 = [number?];
type t05 = [number?, string?];
// type t06 = [number?, string, boolean?]; // => ignorable
type t07 = [number, ...number[]];
type t08 = [number, string?, ...number[]];
type t08a= [number, string?, ...boolean[]];
type t09 = [number, {a: number}];
type t10 = [number, {a?: number}];
type t11 =  [number, {a: number, b?:number}?];

type q01<T> = T extends Array<infer E> ? E : never;

type q02<T> = {[K in keyof T]: T[K]};

type tttt01 = t01['length'];

type tt4es = q02<t08a>;
type ttsg = {[K in keyof t08a]: t08a[K]};
type tt01 = q02<t02>;

type a00 = q01<t00>;
type a01 = q01<t01>;
type a02 = q01<t02>;

type f00 = StrictOptional<t00>;
type f01 = StrictOptional<t01>;
type f02 = StrictOptional<t02>;
type f03 = StrictOptional<t03>;
type f04 = StrictOptional<t04>;
type f05 = StrictOptional<t05>;
// type f06 = StrictOptional<t06>;
type f07 = StrictOptional<t07>;
type f08 = StrictOptional<t08>;
type f09 = StrictOptional<t09>;
type f10 = StrictOptional<t10>;
type f11 = StrictOptional<t11>;

type OptPropNames<O extends object> = {
  [K in keyof O]-?: O extends {[_ in K]-?: O[_]} ? never : K;
}

type f12 = OptPropNames<t03>;
type f12a = f12[Exclude<keyof f12, keyof []>]
type f12b = [][number]