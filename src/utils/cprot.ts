export type InstanceRef<P extends object, I extends object> = Readonly<P> & I;

export type ReThis<O extends object, T extends object> = {
  [E in keyof O]: O[E] extends (this: void, ...args: infer A) => infer R ? (this: T, ...args: A) => R : O[E];
}

type PcdOptions<P extends object, Ipu extends object, Ipr extends object, A extends any[]> = {
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

export type ProtoDef<Pcd>
= Pcd extends ProtoClassDef<infer P, infer Ipu, infer Ipr, any>
? ReThis<P, InstanceRef<P, Ipu & Ipr>>
: never;

export type ConstructorPrototype<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, infer A>
? {
  new(...args: A): InstanceRef<P, Ipu>;
  (this: InstanceRef<P, Ipu & Ipr>, ...args: A): void;

  prototype: ProtoDef<Pcd>;
  }
: never;

export type CInstUnwrap<Pcd>
= Pcd extends PcdOptions<infer P, infer Ipu, infer Ipr, infer A>
? new(...args: A) => InstanceRef<P, Ipu>
: never;
