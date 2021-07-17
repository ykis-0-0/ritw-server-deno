export type Schema = Readonly<{
  /**
   * The directory where all logs resides. Must end with a trailing slash.
   */
  logRoot: string;
}>;