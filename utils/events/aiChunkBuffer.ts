const aiChunkBuffer: string[] = [];

export function addToAiChunkBuffer(chunk: string) {
  aiChunkBuffer.push(chunk);
}

export function consumeAiChunkBuffer(): string[] {
  const chunks = [...aiChunkBuffer];
  aiChunkBuffer.length = 0;
  return chunks;
}
