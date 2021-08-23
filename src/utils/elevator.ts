import * as path from '::std/path/mod.ts';

//! Configuration of directories

let srcRoot: string | null = null;

export const roots = new class {
  get #srcRoot(){
    if(srcRoot !== null) return srcRoot;
    throw new ReferenceError('script root not specified');
  }

  get logRoot() { return path.join(this.#srcRoot, '..', 'logs/'); }

  get pagesRoot() { return path.join(this.#srcRoot, '..', 'pages/'); }

  get assetRoot() { return path.join(this.#srcRoot, '..', 'assets/'); }

};

const generateQuestions: () => { permDesc: Deno.PermissionDescriptor; reason?: string;}[] = () => [
  { permDesc: { name: 'write', path: roots.logRoot }, reason: 'log storage'},
  { permDesc: { name: 'read', path: roots.pagesRoot }, reason: 'site pages'},
  { permDesc: { name: 'read', path: roots.assetRoot }, reason: 'static assets'},
  { permDesc: { name: 'net'}, reason: 'hosting the server'},
];

export async function elevate(mainUrl: string) {
  srcRoot = path.dirname(path.fromFileUrl(mainUrl)); // Deno.mainModule will need permissions, which we don't want to ask for
  for (const el of generateQuestions()){
    console.info(`${el.permDesc.name.toUpperCase()} access${'path' in el.permDesc ? ` at ${el.permDesc.path}` : ''} is required${'reason' in el ? ` for ${el.reason}` : ''}.`);
    const permStatus = await Deno.permissions.request(el.permDesc);
    if(permStatus.state === 'granted') continue;

    console.error('Access is denied, exiting.');
    Deno.exit(1);
  }
  console.log(); // An empty line to make things easier to read
}