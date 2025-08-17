let aiChunkBuffers: Record<string, string[]> = {};

export function addToAiChunkBuffer(id: string, chunk: string) {
  if (!aiChunkBuffers[id]) aiChunkBuffers[id] = [];
  aiChunkBuffers[id].push(chunk);
}

export function consumeAiChunkBuffer(id: string): string[] {
  const chunks = [...(aiChunkBuffers[id] ?? [])];
  aiChunkBuffers[id] = [];
  return chunks;
}

export function resetAiChunkBuffer(id: string) {
  delete aiChunkBuffers[id];
  console.log(`AI chunk buffer for ID ${id} has been reset.`, aiChunkBuffers);
}
