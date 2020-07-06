cd ${0%/*}
export DENO_DIR=`pwd`
./deno run -A --importmap=./importmap.json --unstable ./src/index.ts
