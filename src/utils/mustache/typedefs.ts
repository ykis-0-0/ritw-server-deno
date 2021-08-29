import type Mustache from 'Mustache';

export type TokenTreeNode = [
  type: SpanTypes,
  /**
   * For mustache tags this is whatever else was inside the tag besides the opening symbol.
   * For text tokens this is the text itself.
   */
  value: string,
  start: number, // Starting index of token in original template
  end: number, // and the Matching Ending index, in the form of [start, end)
  ... more: ([] | SubtreeDetails | PartialDetails)
];

export type SubtreeDetails = [
  children: TokenTreeNode[],
  endingTagOffset: number // Start of ending tag, number itself not incl.
];

export type PartialDetails = [
  /**
   * contents appearing before the starting tag on the line,
   * with all characters replaced with space
   */
  paddingStart: string,
  selfIndexWithinLine: number, // index of the tag among all those from the same line
  lineHasNonSpace?: boolean
];

export type SpanTypeDict = {
  RAW_VALUE: 'text';
  ESCAPED_VALUE: 'name';
  UNESCAPED_VALUE: '&';
  SECTION: '#';
  INVERTED: '^';
  COMMENT: '!';
  PARTIAL: '>';
  EQUAL: '=';
};

export type SpanTypes = SpanTypeDict[keyof SpanTypeDict];

export type View
= Record<string, unknown>
| (typeof Mustache)['Context'];

export type PartialsPool
= Record<string, string>
| ((partialName: string) => string);

export type Tags = [open: string, close: string];

export type TagsOrRenderOptions
= Tags
| { tags?: Tags; escape?: (value: any) => string; };