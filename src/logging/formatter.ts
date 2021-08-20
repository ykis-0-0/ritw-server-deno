import * as colors from '::std/fmt/colors.ts';
import type { LogRecord } from '::std/log/logger.ts';

import getDateString from '::/utils/dstring_iso.ts'

export const LOG_UNIT_PATH: unique symbol = Symbol();

export default (isConsole: boolean) => function formatter(_: LogRecord): string {
  let
    iden // Identity Function
      : <T, >(_: T) => T
      = _ => _,
    ifelse // Expressionized If-else condition
      : <I, O>(_: ($: any) => boolean) => (t: (_: I) => O, f: (_: I) => O) => ($: any) => ((_: I) => O)
      = _ => (t, f) => $ => _($) ? t : f,
    fnCases // Expressionized `switch` clause for Functions typed (In => Out)
      : <Mi, M, F, T>(f: (_: Mi) => M, m: M[], t: ((_: F) => T)[], d:((_: F) => T)) => ($: Mi) => ((_: F) => T)
      = (f, m, t, d) => $ => (<F, T>(_: ((_: F) => T)[]) => _.length === 1 ? _[0] : d)(t.filter((_, i) => m[i] === f($)));

  let
    wrap // in [brackets]
      : (_: string) => string
      = _ => `[${_}]`,
    forConsole // or we turn off colorings
      = ($: ($$: string) => string) => ifelse<string, string>(iden)($, iden)(isConsole),
    choose // formattings from level
      = fnCases<string, string, string, string>(iden, ['CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'], [_ => colors.bold(colors.red(_)), colors.red, colors.yellow, colors.dim, iden], iden),
    highlight // Ummmm.. What's this?
      = ifelse<string, string>(_ => _ === 'CRITICAL')(colors.red, iden);

  let
    time: string = getDateString(undefined, _.datetime),
    lvel: string = ifelse<string, string>(iden)((_: string) => choose(_)(_), iden)(isConsole)(_.levelName), // We chose to only color the level names, this way it looks cleaner
    name: string = _.loggerName,
    path: string | undefined = ((_: unknown) => typeof _ ==='object' ? (_ as ({[LOG_UNIT_PATH]?: string} | null))?.[LOG_UNIT_PATH]: undefined)([..._.args].pop());
  let r: string =
    '    ' + forConsole(colors.white)([time, lvel, name].concat([...(path || [] as [])]).map(wrap).join(' ')) + '\n' + // We can't do [t, l, n, p] 'cause there will be an `undefined` if p undef
    _.msg +
    '\n';
  return r;
}
