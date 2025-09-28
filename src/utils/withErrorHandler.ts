export function withErrorHandler<T>(operation: () => T, message?: string): T {
  try {
    return operation();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? message || error.message : message;
    throw new Error(errorMessage);
  }
}