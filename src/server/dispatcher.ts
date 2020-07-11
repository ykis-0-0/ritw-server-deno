import { ServerRequest } from 'deno_std/http/mod.ts';

import './endpoints/mod.ts';

interface Dispatcher {
  listeners: [string, string][];
  //handle(req: ServerRequest | undefined): boolean;
}

interface ConstructorPrototype<T> {
  (this: typeof globalThis | undefined, ...args: any): T;
  (this: T, ...args: any): void;
  new(): T;

  prototype: T;
}

type a = DateConstructor;

var Dispatcher : new() => Dispatcher = function(this: Dispatcher, a: string): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this.listeners = [];
} as ConstructorPrototype<Dispatcher> as new() => Dispatcher;

Dispatcher.prototype.handle = function(req: ServerRequest | undefined) { return false};

let a = new Dispatcher();
a.handle(undefined);