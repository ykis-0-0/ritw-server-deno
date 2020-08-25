type RtOne<F, T extends object>
= F extends ((this: unknown, ...args: infer A) => infer R) ? ((this: T, ...args: A) => R) : F;

export type ReThis<O extends object, T extends object> = {
  [E in keyof O]: RtOne<O[E], T>;
}

type PcdOptions<P extends object, Ipu extends object, Ipr extends object, A extends unknown[]> = {
  P: P;
  Ipu: Ipu;
  Ipr: Ipr;
  A: A;
};

export type ProtoClassDef<P extends object, Ipu extends object, Ipr extends object, F> = F extends ((this: unknown, ...args: infer A) => infer R)
? void extends R
  ? PcdOptions<P, Ipu, Ipr, A>
  : never
: never;

export type InstancePrv<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, unknown[]>
? Readonly<P> & Ipu & Ipr
: never;

export type InstancePub<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, unknown[]>
? Readonly<P> & Ipu
: never;

export type ProtoDef<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, unknown[]>
? ReThis<P, InstancePrv<Pcd>>
: never;

export type ConstructorPrototype<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, infer A>
? {
  new(...args: A): InstancePub<Pcd>;
  (this: InstancePrv<Pcd>, ...args: A): void;

  prototype: ProtoDef<Pcd>;
  }
: never;

export type CInstUnwrap<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, infer A>
? new(...args: A) => InstancePub<Pcd>
: never;
