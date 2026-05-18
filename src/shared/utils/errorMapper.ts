export function toUserMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Nao foi possivel concluir a acao agora.";
}

