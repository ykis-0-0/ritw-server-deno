import * as path from '::std/path/mod.ts';
import { AllWritable } from './typedefs/type_ops.ts';
import { ObjectDefineProperty } from './typedefs/defprop.ts';

const BASE_PATH = Symbol('Reference base path for paths');

type This = {
  //@ts-expect-error
  anchor?: (this: AllWritable<This>, mainModulePath: string) => asserts this is Omit<This, 'anchor'>;
  rebase: (this: Omit<This, 'anchor'>, href: string) => string;
  readonly [BASE_PATH]: string;
}

const theAnchor: Omit<This, typeof BASE_PATH> = {
  anchor: function(this, mainModulePath) {
    if(!path.isAbsolute(mainModulePath)) throw new TypeError('Absolute path required');
    this[BASE_PATH] = mainModulePath;
    delete this.anchor;
  },
  rebase: function(this, href){
    const rtv = path.join(this[BASE_PATH], href);
    console.log(`@ ${rtv}`);
    if(!rtv.startsWith(this[BASE_PATH])) throw new EvalError('Resolved path escaped from base');
    return rtv;
  }
};

const defProp: ObjectDefineProperty = Object.defineProperty;
const setter: (this: Omit<This, typeof BASE_PATH>, _path: string) => void = function(this, _path){
  const desc = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: path.join(path.dirname(_path), '../')
  };
  defProp(this, BASE_PATH, desc);
  console.log(`=> ${_path}\n=> ${desc.value}\n=> ${this[BASE_PATH]}`);
};

defProp(theAnchor, BASE_PATH, {
  configurable: true,
  enumerable: false,
  get: function(){ throw new ReferenceError('Anchor Base is not yet defined'); },
  set: setter,
});

export default theAnchor;
