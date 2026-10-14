import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/api';

export type FieldErrors = Record<string, string | undefined>;

class ErrorUtil {
  private static instance: ErrorUtil;
  private readonly fallbackMessage = 'Something went wrong. Please try again.';

  private constructor() {}

  public static getInstance(): ErrorUtil {
    if (!ErrorUtil.instance) {
      ErrorUtil.instance = new ErrorUtil();
    }
    return ErrorUtil.instance;
  }

  public getMessage(error: unknown): string {
    if (isAxiosError<ApiErrorResponse>(error)) {
      if (!error.response) return 'Unable to reach the server. Check your connection.';
      return error.response.data?.message || this.fallbackMessage;
    }
    if (error instanceof Error) return error.message;
    return this.fallbackMessage;
  }

  // Maps backend zod `fieldErrors` to the first message per field
  public getFieldErrors(error: unknown): FieldErrors {
    if (!isAxiosError<ApiErrorResponse>(error)) return {};
    const fieldErrors = error.response?.data?.details?.fieldErrors ?? {};
    return Object.fromEntries(
      Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0]]),
    );
  }

  public getStatus(error: unknown): number | undefined {
    return isAxiosError(error) ? error.response?.status : undefined;
  }
}

export default ErrorUtil.getInstance();
