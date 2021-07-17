import * as path from '::std/path/mod.ts';

const anchor = new (class {

  readonly #BASE_PATH: string | null = null; // readonlyed to prevent accidental assignment

  get #basePath() {
    if(this.#BASE_PATH === null) throw new ReferenceError('Still floating');
    return this.#BASE_PATH
  }

  set #basePath(value) {
    if(this.#BASE_PATH !== null) throw new ReferenceError('Already settled');
    //@ts-expect-error it's the only exception
    this.#BASE_PATH = value;
  }

  anchor(mainModulePath: string) {
    if(this.#basePath !== null) throw new ReferenceError('Already anchored');
    this.#basePath = mainModulePath;
  }

  rebase(href: string){
    const rtv = path.join(this.#basePath, href);
    if(!rtv.startsWith(this.#basePath)) throw new EvalError('Resolved path escaped from base');
    return rtv;
  }
})();

export default anchor;