import { isObject } from '@nestjs/common/utils/shared.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isExceptionObject(err: any): err is Error {
  return isObject(err) && !!(err as Error).message;
}
