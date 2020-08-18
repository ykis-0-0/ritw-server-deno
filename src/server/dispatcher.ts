import { ServerRequest } from 'deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoDef, InstanceRef, ReThis } from '../utils/cprot.ts';

import './endpoints/mod.ts';

interface DispatcherPrivate {
  triggers: {
    [path: string]: (req: ServerRequest | undefined) => boolean
  };
}

interface DispatcherPublic {
  // TODO will we even have Public fields?
}

interface DispatcherProto {
  handle(req: ServerRequest | undefined): boolean;
  registerTrigger(path: string, handler: (req: ServerRequest | undefined) => boolean): void;
}

// TODO should we cast it into new() => Dispatcher?

const Dispatcher = function(): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this.triggers = {};
} as ConstructorPrototype<DispatcherProto, DispatcherPrivate & DispatcherPublic, () => void>;

let prot: ProtoDef<typeof Dispatcher> = {
  handle: function(req) {
    return false;
  },
  registerTrigger: function(path, handler) {
    if(path in this.triggers) throw new ReferenceError('path already claimed');
    this.triggers[path] = handler;
  }
};

//Dispatcher.prototype = prot;

let a = new Dispatcher();
a.handle(undefined);