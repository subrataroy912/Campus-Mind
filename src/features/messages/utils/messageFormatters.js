export function splitIntoReadableParagraphs(text) {
  const normalized = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!normalized) return [];

  const rawParagraphs = normalized.split(/\n{2,}/);
  const result = [];

  for (const block of rawParagraphs) {
    if (!block.includes("\n") && block.length > 380) {
      const sentences = block.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [
        block,
      ];
      let currentChunk = "";
      let sentenceCount = 0;
      for (const sentence of sentences) {
        currentChunk += sentence;
        sentenceCount += 1;
        if (sentenceCount >= 3 && currentChunk.length >= 220) {
          result.push(currentChunk.trim());
          currentChunk = "";
          sentenceCount = 0;
        }
      }
      if (currentChunk.trim()) {
        result.push(currentChunk.trim());
      }
    } else {
      result.push(block);
    }
  }

  return result;
}
