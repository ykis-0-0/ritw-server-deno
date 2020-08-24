import { ByFnSignature } from "./types.ts";

export default function getDateString(folder: boolean = false, d: Date = new Date()): string{

  const pp: (__: number) => ((_: keyof ByFnSignature<[], number, Date>, $:number) => string)
  = (__ => (_, $) => (d[_]() + __).toString().padStart($, '0'));

  const p: (_: keyof ByFnSignature<[], number, Date>, $: number) => string = pp(0);

  let rd: string[] = [
    d.getFullYear().toString(),
    pp(1)('getMonth', 2),
    p('getDate', 2)
  ];

  let rt: string[] = [
    p('getHours', 2),
    p('getMinutes', 2),
    p('getSeconds', 2) + '.' + p('getMilliseconds', 3)
  ]

  let o: number[] =  [Math.sign, Math.abs].map(_ =>_(d.getTimezoneOffset()));
  let rz: string[] = [
    ['+', 'Z', '-'][o[0] + 1],
    Math.floor(o[1] / 60).toString().padStart(2, '0'),
    (o[1] % 60).toString().padStart(2, '0')
  ];

  let r: string = rd.join(folder ? '' : '-') + (folder ? 'T' : ' ') + rt.join(folder ? '' : ':') + (folder ? rz.join('') : '');

  return r;
}