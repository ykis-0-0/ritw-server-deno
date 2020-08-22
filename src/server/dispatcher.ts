import { ServerRequest } from 'deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoClassDef, ProtoDef, CInstUnwrap } from '../utils/cprot.ts';

import './endpoints/mod.ts';

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
  handle(req: ServerRequest | undefined): boolean;
  registerTrigger(path: string, handler: (req: ServerRequest | undefined) => boolean): void;
}

interface DispatcherStatic {
  getDispatcher(id: string): Exported
}

type Dispatcher = ProtoClassDef<DispatcherProto, DispatcherPublic, DispatcherPrivate, () => void>;

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

type Exported = CInstUnwrap<Dispatcher>;

const exp: DispatcherStatic & Exported = Object.assign(Dispatcher, {getDispatcher});

function getDispatcher(id: string): Exported {
  if(!(id in dispatchers)) throw new ReferenceError('non existent id');
  return dispatchers[id];
}

let dispatchers: { [id: string]: Exported;} = {};

let a = new Dispatcher();
a.handle(undefined);

export default Dispatcher as Exported;