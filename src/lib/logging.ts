export function logError(event: string, error: unknown) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const details =
    error instanceof Error
      ? { name: error.name, ...(isDevelopment ? { message: error.message } : {}) }
      : { name: "UnknownError", ...(isDevelopment ? { message: String(error) } : {}) };

  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event,
      error: details,
    }),
  );
}
