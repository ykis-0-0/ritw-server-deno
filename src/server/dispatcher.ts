import { ServerRequest } from '$deno_std/http/mod.ts';

//const dispatchers: {[name: string]: Dispatcher} = {};

interface DispatcherRequest extends ServerRequest {
  dispatchedUrl?: string;
}

function checkPath(path: string | typeof Dispatcher.defaultHandler): void {
  if(path === Dispatcher.defaultHandler) return;

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

export default class Dispatcher {
  #triggers: {
    [path: string]: (req: DispatcherRequest) => boolean;
    [Dispatcher.defaultHandler]?: (req: DispatcherRequest) => boolean;
  }
  #subordinateOf: string | null;
  static readonly defaultHandler: unique symbol = Symbol('For private fields access');
  //@ts-ignore
  static #dispatchers: {[name: string]: Dispatcher} = {}

  constructor() {
    if(!new.target) throw new SyntaxError('Please use new Dispatcher()');
    this.#triggers = {};
    this.#subordinateOf = null;
  }

  registerTrigger(path: string | typeof Dispatcher.defaultHandler, handler: ((req: DispatcherRequest) => boolean) | Dispatcher): void{
    if(path in this.#triggers) throw new ReferenceError('path already claimed');

    checkPath(path);

    // TODO
    // => maybe think of a better solution?
    // => feelings this must have bugs of some sort.
    if(handler instanceof Dispatcher){
      if(handler === this) throw new EvalError('so we\'ve got a problem huh?');
      if(path === Dispatcher.defaultHandler) throw new EvalError('so you said you know what you doing and show me this shit?');

      if(this.#subordinateOf !== null)
        throw new ReferenceError('dispatchers should not be mounted in two different paths');

      handler.#subordinateOf = (this.#subordinateOf ?? '') + path;
      this.#triggers[path] = handler.handle.bind(handler);
      return;
    }
    this.#triggers[path] = handler;
  }

  dropTrigger(path: string | typeof Dispatcher.defaultHandler){
    if(!(path in this.#triggers)) throw new ReferenceError('path not claimed');
    delete this.#triggers[path];
  }

  handle(req: DispatcherRequest){
    let _url = req.url.slice(this.#subordinateOf?.length);

    const matches: string[] = Object.keys(this.#triggers)
      .sort().reverse()
      .filter(_ => _url.startsWith(_));
    
    for(const match of matches){
      req.dispatchedUrl = _url.slice(match.length);
      if(this.#triggers[match](req)) return true;
    }

    return (this.#triggers[Dispatcher.defaultHandler] ?? (_ => false))(req);
  }

  static getDispatcher(name: string): Dispatcher{
    if(!(name in Dispatcher.#dispatchers)) throw new ReferenceError('name not found');
    return Dispatcher.#dispatchers[name];
  }
}