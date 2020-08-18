export type InstanceRef<P extends Object, I extends Object> = Readonly<P> & I;

export type ReThis<O extends Object, T extends Object> = {
  [E in keyof O]: O[E] extends (this: void, ...args: infer A) => infer R ? (this: T, ...args: A) => R : O[E];
}

export type ProtoDef<C> = C extends ConstructorPrototype<infer P, infer I, infer F> ? ReThis<P, InstanceRef<P, I>> : never;

export type ConstructorPrototype<P extends Object, I extends Object, F extends (this: void, ...args: any) => void> = F extends (this: void, ...args: infer A) => void ? {
  (this: InstanceRef<P, I>, ...args: A): void;
  new(...args: A): InstanceRef<P, I>;

  prototype: ReThis<P, InstanceRef<P, I>>;
} : never;

export type RecurseType<T> = T extends (this: infer Q, ...args: infer A) => infer R
  ? (this: RecurseType<Q>, ...args: A) => RecurseType<R>
  : T extends object
  ? T extends infer O
  ? {
    [K in keyof O]: RecurseType<O[K]>
  }
  : never
  : T;