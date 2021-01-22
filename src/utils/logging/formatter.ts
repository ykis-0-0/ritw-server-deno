import * as colors from 'std://fmt/colors.ts';
import type { LogRecord } from 'std://log/logger.ts';

import getDateString from '../dstring_iso.ts'

export default (isConsole: boolean) => function formatter(_: LogRecord): string {
  let 
    iden // Identity Function
      : <T, >(_: T) => T
      = _ => _,
    ifelse // Expressionized If-else condition
      : <I, O>(_: ($: any) => boolean) => (t: (_: I) => O, f: (_: I) => O) => ($: any) => ((_: I) => O)
      = _ => (t, f) => $ => _($) ? t : f,
    cases // Expressionized `switch` clause for Functions typed (In => Out)
      : <Mi, M, F, T>(f: (_: Mi) => M, m: M[], t: ((_: F) => T)[], d:((_: F) => T)) => ($: Mi) => ((_: F) => T)
      = (f, m, t, d) => $ => (<F, T>(_: ((_: F) => T)[]) => _.length === 1 ? _[0] : d)(t.filter((_, i) => m[i] === f($)));
  let
    wrap // in [brackets]
      : (_: string) => string
      = _ => `[${_}]`,
    forConsole // or we turn off colorings
      = ($: ($$: string) => string) => ifelse<string, string>(iden)($, iden)(isConsole),
    choose // formattings from level
      = cases<string, string, string, string>(iden, ['CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'], [_ => colors.bold(colors.red(_)), colors.red, colors.yellow, colors.dim, iden], iden),
    highlight // Ummmm.. What's this?
      = ifelse<string, string>(_ => _ === 'CRITICAL')(colors.red, iden);
  let
    t: string = getDateString(undefined, _.datetime),
    l: string = ifelse<string, string>(iden)((_: string) => choose(_)(_), iden)(isConsole)(_.levelName), // We chose to only color the level names, this way it looks cleaner
    n: string = _.loggerName,
    e: string[] | undefined = 0 in _.args ? [_.args[0] as string] : undefined;
  let r: string =
    '    ' + forConsole(colors.white)(Array.prototype.concat.apply([t, l, n], e as any[]).map(wrap).join(' ')) + '\n'+
    _.msg +
    '\n';
  return r;
}
