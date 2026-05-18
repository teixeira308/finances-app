type LogLevel = "info" | "warn" | "error";

function redact(message: unknown) {
  return typeof message === "string"
    ? message.replace(/[0-9]+(?:[.,][0-9]{2})?/g, "[REDACTED_AMOUNT]")
    : message;
}

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const safeContext = context
    ? Object.fromEntries(Object.entries(context).map(([key, value]) => [key, redact(value)]))
    : undefined;
  return { level, message: redact(message), context: safeContext };
}

