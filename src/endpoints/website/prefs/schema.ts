export type Schema = Readonly<{
  /**
   * URL of the site root at the server
   */
  urlRoot: string;

  /**
   * location in the filesystem of files to be used for serving
   */
  serveRoot: string;
}>;