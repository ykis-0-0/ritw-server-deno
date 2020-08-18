import { ServerRequest } from 'deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoDef, InstanceRef, RecurseType, ReThis } from '../utils/cprot.ts';

import './endpoints/mod.ts';

interface DispatcherPrivate {
  triggers: [string, string][];
  handlers: [string, (req: ServerRequest | undefined) => boolean][];
}

interface DispatcherPublic {
  // TODO will we even have Public fields?
}

interface DispatcherProto {
  handle(req: ServerRequest | undefined): boolean;
  registerHandler(name: string, handler: (req: ServerRequest | undefined) => boolean): boolean;
  registerTrigger(name: string, path: string): boolean;
}

// TODO should we cast it into new() => Dispatcher?

const Dispatcher = function(): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this.triggers = [];
  this.handlers = [];
} as ConstructorPrototype<DispatcherProto, DispatcherPrivate & DispatcherPublic, () => void>;

let prot: ProtoDef<typeof Dispatcher> = {
  handle: function(req) {
    return false;
  },
  registerHandler: function(name, handler) {
    return false;
  },
  registerTrigger: function(name, path) {
    return false;
  }
};

//Dispatcher.prototype = prot;

let a = new Dispatcher();
a.handle(undefined);