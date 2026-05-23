type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

// Global hook for external monitoring services (US6)
let monitorHook: ((payload: LogPayload) => void) | null = null;

export function setMonitorHook(hook: (payload: LogPayload) => void) {
  monitorHook = hook;
}

function redact(message: unknown): unknown {
  if (typeof message !== "string") return message;
  
  return message
    // Redact financial amounts (e.g., 10.00, 1,000.50)
    .replace(/\b\d+([.,]\d{2})?\b/g, "[REDACTED_AMOUNT]")
    // Redact emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
    // Redact potential UUIDs/Tokens
    .replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, "[REDACTED_ID]");
}

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const safeContext = context
    ? Object.fromEntries(Object.entries(context).map(([key, value]) => [key, redact(value)]))
    : undefined;
  
  const safeMessage = redact(message) as string;
  const payload: LogPayload = {
    level,
    message: safeMessage,
    context: safeContext,
    timestamp: new Date().toISOString()
  };

  // Send to external monitor if configured
  if (level === 'error' && monitorHook) {
    monitorHook(payload);
  }
  
  if (import.meta.env.DEV) {
    console[level](`[${level.toUpperCase()}] ${safeMessage}`, safeContext || "");
  }

  return payload;
}

