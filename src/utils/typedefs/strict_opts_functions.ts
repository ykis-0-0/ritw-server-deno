import StrictOptional from './strict_opts.ts';

type t0 = () => void;

type q0<T> = T extends ((this: unknown, ...args: unknown[]) => unknown) | (new (...args: unknown[]) => unknown)? 1 : 0;
type q1<T> = T extends object ? 1 : 0;

type a0 = q0<t0>;
type a1 = q1<t0>;
type a2 = keyof t0;
type a3 = never | number;
type a4 = StrictOptional<t0>;