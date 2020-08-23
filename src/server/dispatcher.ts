import { ServerRequest } from '$deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoClassDef, ProtoDef, CInstUnwrap, InstancePrv, InstancePub } from '../utils/cprot.ts';

import './endpoints/mod.ts';

const privates_: unique symbol = Symbol('For private fields access');
const defaultHandler: unique symbol = Symbol('default handler for triggers');

interface DispatcherPrivate {
  // => I think we don't have privates this time
}

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
  dropTrigger(path: string): void;
}

type Dispatcher = ProtoClassDef<DispatcherProto, DispatcherPublic, DispatcherPrivate, () => void>;

interface DispatcherStatic {
  readonly defaultHandler: typeof defaultHandler;
  getDispatcher(name: string): InstancePub<Dispatcher>;
}

const Dispatcher = function(): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this[privates_].triggers = {};
} as ConstructorPrototype<Dispatcher>;

let prot: ProtoDef<Dispatcher> = { 
  handle: function(req) {
    const matches: string[] = Object.keys(this[privates_].triggers).sort().reverse().filter(_ => req.url.startsWith(_));
    if(matches.length === 0) return false;

    const match: string = matches[0];
    req.url = req.url.replace(match, '');

    return this[privates_].triggers[match](req);
  },
  registerTrigger: function(path, handler) {
    if(path in this[privates_].triggers) throw new ReferenceError('path already claimed');

    if(!path.startsWith('/')) throw new SyntaxError('path must start with /');

    // => unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
    // => sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
    const pchars: string[] = [
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ...'abcdefghijklmnopqrstuvwxyz',
      ...'0123456489', ...'-._~', ...'!$'
    ];

    if(![...path].every(_ => pchars.includes(_))) throw new SyntaxError('path contain illegal characters');
    
    this[privates_].triggers[path] = handler;
  },
  dropTrigger: function(path) {
    if(!(path in this[privates_].triggers)) throw new ReferenceError('path not claimed');
    delete this[privates_].triggers[path];
  }
};

Dispatcher.prototype = prot;

const dispatchers: { [name: string]: InstancePrv<Dispatcher>;} = {};

const statics: DispatcherStatic = {
  defaultHandler,
  getDispatcher: function(name: string): InstancePrv<Dispatcher> {
    if(!(name in dispatchers)) throw new ReferenceError('name not found');
    return dispatchers[name];
  }
}

type Exported = CInstUnwrap<Dispatcher> & DispatcherStatic;
const exports: Exported = Object.assign(Dispatcher, statics);

export default exports;