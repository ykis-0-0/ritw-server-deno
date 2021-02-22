import SO, { Optionals } from './strict_opts.ts';

// ? Primitives => Throws due to `extends object` constraint
/*
type p01 = SO<number>;
// -> error
type p02 = SO<boolean>;
// -> error
type p03 = SO<string>;
// -> error
type p04 = SO<null>;
// -> error
type p05 = SO<undefined>;
// -> error
type p06 = SO<void>; // => void, by definition, a unit type also assignable by undefined
// -> error
type p07 = SO<never>; // => never, by definition, is an empty union>;
// -> never
*/

// ? Functions and Constructors => Unchanged
type f01 = SO<()=>void>;
// -> () => void
type f02 = SO<new () => object>;
// -> new () => object

// ? Arrays and Tuples
// ! All Unimplemented below
// TODO Find a way to properly strip the optional part of tuple
type a00 = SO<[]>;
// -> []
type a01 = SO<number[]>;
// -> number[]
type a02 = SO<[number]>;
// -> [number]
type a03 = SO<[number, string?]>; // ! only optional or rest elements can follow a optional element>;
// -> [number] | [number, string]
type a04 = SO<[number, ...boolean[]]>; // ! no optional or rest elements can follow a rest element>
// -> [number, ...boolean[]]
// ? Objects
type o00 = SO<{}>;
// -> {}
type o01 = SO<{a: number;}>;
// -> {a: number;}
type o02 = SO<{b?: number;}>; // //number, number | undefined
type o02a= Optionals<{b?: number;}>;
// -> {b: number;} | {b: never;}
type o03 = SO<{c: {c1?: string;};}>;
// -> {c: {c1: string;} | {c1: never;}}
type o04 = SO<{d: undefined;}>;
// -> {d: undefined;}
type o05 = SO<{e?: undefined;}>;
// -> {e: undefined;} | {e: never;}
type o05a= Required<{e?: undefined;}>;
// -> {e: never;}
type o06 = SO<{f?: never;}>;
// -> {f: never;}
type o07 = SO<{g: null;}>;
// -> {g: null}
