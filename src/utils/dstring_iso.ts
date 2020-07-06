export default function getDateString(folder: boolean = false, d: Date = new Date()): string{

  let pp: (__: number) => ((_: string, $:number) => string);
  
  pp = (__ => (_, $) => ((d as any)[_]() + __).toString().padStart($, 0));
  let p: (_: string, $: number) => string = pp(0);

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