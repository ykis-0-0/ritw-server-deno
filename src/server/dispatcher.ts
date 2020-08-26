import { ServerRequest } from '$deno_std/http/mod.ts';

import { ConstructorPrototype, ProtoClassDef, ProtoDef, CInstUnwrap, InstancePrv, InstancePub } from '../utils/cprot.ts';

import './endpoints/mod.ts';

interface DispatcherRequest extends ServerRequest {
  dispatchedUrl?: string;
}

const privates_: unique symbol = Symbol('For private fields access');
const priv = {
  get(k: symbol): DispatcherPrivate {
    return Reflect.get(this, k);
  },
  init(k: symbol): void {
    const fields: DispatcherPrivate = {
      triggers: {},
      [subordinateOf_]: null
    }
    if(k in this) throw new ReferenceError('symbol clash!');
    Reflect.set(this, k, fields);
  }
};

const defaultHandler: unique symbol = Symbol('default handler for triggers');
const subordinateOf_: unique symbol = Symbol('Marker of subordinate trigger');

interface DispatcherPrivate {
  // => I think we don't have privates this time
  triggers: {
    [path: string]: (req: ServerRequest) => boolean;
    [defaultHandler]?: (req: ServerRequest) => boolean;
  };
  [subordinateOf_]: string | null;
}

interface DispatcherPublic {
  [privates_]: symbol;
}

interface DispatcherProto {
  handle(req: DispatcherRequest): boolean;
  registerTrigger(path: string | typeof defaultHandler, handler: ((req: DispatcherRequest) => boolean) | InstancePub<Dispatcher>): void;
  dropTrigger(path: string): void;
}

type Dispatcher = ProtoClassDef<DispatcherProto, DispatcherPublic, DispatcherPrivate, () => void>;

interface DispatcherStatic {
  readonly defaultHandler: typeof defaultHandler;
  getDispatcher(name: string): InstancePub<Dispatcher>;
}

const Dispatcher = function(): void {
  if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
  this[privates_] = Symbol();
  priv.init(this[privates_]);
  /*
  this[privates_] = {
    triggers: {},
    [subordinateOf_]: null
  };
  */
} as ConstructorPrototype<Dispatcher>;

function checkPath(path: typeof defaultHandler | string): void {
  if(path === defaultHandler) return;

  if(!path.startsWith('/')) throw new SyntaxError('path must start with /');
  if(path.endsWith('/')) throw new SyntaxError('path must not end with /');

  if(path === '/') throw new ReferenceError('you\'re trying to mount a dispatcher on the same path under another dispatcher, huh?');

  // => unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
  // => sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
  const pchars: string[] = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...'abcdefghijklmnopqrstuvwxyz',
    ...'0123456489', ...'-._~', ...'!$'
  ];

  if(![...path].slice(1).every(_ => pchars.includes(_))) throw new SyntaxError('path contain illegal characters, and should only be 1-deep');

}

let prot: ProtoDef<Dispatcher> = {
  handle: function(req) {
    let _url = req.url;

    if(priv.get(this[privates_])[subordinateOf_] !== null) _url = _url.slice(priv.get(this[privates_])[subordinateOf_]?.length);

    const matches: string[] = Object.keys(priv.get(this[privates_]).triggers).sort().reverse().filter(_ => _url.startsWith(_));

    for(const match of matches){
      req.dispatchedUrl = _url.slice(match.length);
      if(priv.get(this[privates_]).triggers[match](req)) return true;
    }

    return ((priv.get(this[privates_]).triggers[defaultHandler]) ?? (_ => false))(req);
  },
  registerTrigger: function(path, handler) {
    if(path in priv.get(this[privates_]).triggers) throw new ReferenceError('path already claimed');

    checkPath(path);

    // TODO
    // => maybe think of a better solution?
    // => feelings this must have bugs of some sort.
    let hook: (req: ServerRequest) => boolean;
    if(handler instanceof Dispatcher){
      if(handler === this) throw new EvalError('so we\'ve got a problem huh?');
      if(path === defaultHandler) throw new EvalError('so you said you know what you doing and show me this shit?');

      let $dispatch = handler as InstancePub<Dispatcher>;
      if(priv.get($dispatch[privates_])[subordinateOf_] !== null)
        throw new ReferenceError('dispatchers should not be mounted in two different paths');

      priv.get($dispatch[privates_])[subordinateOf_] = (priv.get(this[privates_])[subordinateOf_] ?? '') + path;

      hook = $dispatch.handle.bind($dispatch);
    } else {
      hook = handler as typeof hook;
    }
    priv.get(this[privates_]).triggers[path] = hook;
  },
  dropTrigger: function(path) {
    if(!(path in priv.get(this[privates_]).triggers)) throw new ReferenceError('path not claimed');
    delete priv.get(this[privates_]).triggers[path];
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