/**
 * Checks if the thrown error comes from the "http-errors" library.
 * @param err error object
 */
export function isHttpError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
): err is { statusCode: number; message: string } {
  return err?.statusCode && err?.message;
}
