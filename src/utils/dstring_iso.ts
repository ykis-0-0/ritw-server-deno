import type { ByFnSignature } from "./typedefs/fn_filter.ts";

/**
 * Get a string for date and time, somewhat ISO-8601 compliant? *(maybe, but I just don't want to fuck with the details, i just want it to be usable enough)*
 *
 * `YYYY-MM-DD HH:MM:SS.fff (zzzzz)`
 * - `folder === false`: 2020-01-01 09:30:59.123 (default, no timezone provided)
 * - `folder === true`: 20200101T093059.123+0800
 *
 * @param folder To use normal delimiters on the result string or not
 * @param date *that* date, lol
 * @returns a string, it is literally written ON ITS FUCKING NAME CAN'T YOU SEE THAT?
 */

export default function getDateString(folder: boolean = false, date: Date = new Date()): string{

  // get part of a date, offset it a proper 1-based number, then pad it with zeros
  const pRebased: (__: number) => ((_: keyof ByFnSignature<[], number, Date>, $:number) => string)
  = (__ => (_, $) => (date[_]() + __).toString().padStart($, '0'));

  // get part of a date then pad with zero
  const p: (_: keyof ByFnSignature<[], number, Date>, $: number) => string = pRebased(0);

  // date part
  let partsDate: string[] = [
    date.getFullYear().toString(),
    pRebased(1)('getMonth', 2),
    p('getDate', 2)
  ];

  // time part
  let partsTime: string[] = [
    p('getHours', 2),
    p('getMinutes', 2),
    p('getSeconds', 2) + '.' + p('getMilliseconds', 3)
  ]

  // timezone part
  let offsets: number[] =  [Math.sign, Math.abs].map(_ =>_(date.getTimezoneOffset()));
  let partsTz: string[] = [
    ['+', 'Z', '-'][offsets[0] + 1],
    Math.floor(offsets[1] / 60).toString().padStart(2, '0'),
    (offsets[1] % 60).toString().padStart(2, '0')
  ];

  // the whole datetime string
  let rtv: string
    = partsDate.join(folder ? '' : '-')
    + (folder ? 'T' : ' ')
    + partsTime.join(folder ? '' : ':')
    + (folder ? partsTz.join('') : '')
  ;

  // is it really needed? why don't we just merge it with last line?
  return rtv;
}
