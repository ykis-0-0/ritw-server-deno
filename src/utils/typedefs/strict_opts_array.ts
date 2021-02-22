import StrictOptional from './strict_opts.ts';

type t00 = number[];
type t01 = [number];
type t02 = [number, string?];
type t03 = [number, string?, boolean?];
type t04 = [number?];
type t05 = [number?, string?];
type t06 = [number?, string, boolean?]; // => ignorable
type t07 = [number, ...number[]];
type t08 = [number, string?, ...number[]];
type t09 = [number, {a: number}];
type t10 = [number, {a?: number}];
type t11 =  [number, {a: number, b?:number}?];