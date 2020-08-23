import { ServerRequest } from 'deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoClassDef, ProtoDef, CInstUnwrap, InstancePrv, InstancePub } from '../utils/cprot.ts';

import './endpoints/mod.ts';

const defaultHandler: unique symbol = Symbol('default handler for triggers');

interface DispatcherPrivate {
  triggers: {
    [path: string]: (req: ServerRequest | undefined) => boolean;
  };
}

// ! Empty interfaces may makes ExportUnwrap fails
interface DispatcherPublic {
  // TODO will we even have Public fields?
}

interface DispatcherProto {
  handle(req: ServerRequest): boolean;
  registerTrigger(path: string, handler: (req: ServerRequest) => boolean): void;
}

type Dispatcher = ProtoClassDef<DispatcherProto, DispatcherPublic, DispatcherPrivate, () => void>;

interface DispatcherStatic {
  readonly defaultHandler: typeof defaultHandler;
  getDispatcher(name: string): InstancePub<Dispatcher>;
}

// TODO should we cast it into new() => Dispatcher?

const Dispatcher = function(): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this.triggers = {};
} as ConstructorPrototype<Dispatcher>;

let prot: ProtoDef<Dispatcher> = { 
  handle: function(req) {
    return false;
  },
  registerTrigger: function(path, handler) {
    if(path in this.triggers) throw new ReferenceError('path already claimed');
    this.triggers[path] = handler;
  }
};

Dispatcher.prototype = prot;

let dispatchers: { [name: string]: InstancePrv<Dispatcher>;} = {};

const statics: DispatcherStatic = {
  defaultHandler,
  getDispatcher: function(name: string): InstancePrv<Dispatcher> {
    if(!(name in dispatchers)) throw new ReferenceError('name not found');
    return dispatchers[name];
  }
}

type Exported = CInstUnwrap<Dispatcher> & DispatcherStatic;
const exports: Exported = Object.assign(Dispatcher, statics);

let a = new Dispatcher();

export default exports;