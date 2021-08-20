cd ${0%/*}
export DENO_DIR=`pwd`
./deno "$@"
