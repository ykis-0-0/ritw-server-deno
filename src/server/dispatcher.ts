import { ServerRequest } from 'deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoClassDef, ProtoDef, CInstUnwrap, InstancePrv, InstancePub } from '../utils/cprot.ts';

import './endpoints/mod.ts';

const privates_: unique symbol = Symbol('For private fields access');
const defaultHandler: unique symbol = Symbol('default handler for triggers');

interface DispatcherPrivate {
  // => I think we don't have privates this time
}

// ! Empty interfaces may makes ExportUnwrap fails
interface DispatcherPublic {
  [privates_]: {
    triggers: {
      [path: string]: (req: ServerRequest) => boolean;
    }
  }
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

// => should we cast it into new() => Dispatcher?

const Dispatcher = function(): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this[privates_].triggers = {};
} as ConstructorPrototype<Dispatcher>;

let prot: ProtoDef<Dispatcher> = { 
  handle: function(req) {
    return false;
  },
  registerTrigger: function(path, handler) {
    if(path in this[privates_].triggers) throw new ReferenceError('path already claimed');

    if(!path.startsWith('/')) throw new SyntaxError('path must start with /')

    // => unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
    // => sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
    const pchars: string[] = [
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ...'abcdefghijklmnopqrstuvwxyz',
      ...'0123456489', ...'-._~', ...'!$'
    ];

    if(![...path].every(_ => pchars.includes(_))) throw new SyntaxError('path contain illegal characters');
    this[privates_].triggers[path] = handler;
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