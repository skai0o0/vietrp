import { Character, Message, PronounPair, OpenRouterMessage } from '../types';

export function buildSystemPrompt(
  character: Character,
  pronounPair: PronounPair,
  baseSystemPrompt: string
): string {
  const pronounInstruction = `
Quy tắc xưng hô trong cuộc trò chuyện này:
- User tự xưng: "${pronounPair.userPronoun}"
- User gọi bạn (nhân vật): "${pronounPair.charByUser}"  
- Bạn (nhân vật) tự xưng: "${pronounPair.charPronoun}"
- Bạn gọi User: "${pronounPair.userByChar}"

Hãy tuân thủ nghiêm ngặt cách xưng hô này trong suốt cuộc trò chuyện.`;

  const characterInfo = `
Thông tin nhân vật bạn đang nhập vai:
Tên: ${character.name}

Mô tả nhân vật (Persona):
${character.persona}

Bối cảnh (Scenario):
${character.scenario}

${character.exampleDialogues ? `Ví dụ đối thoại tham khảo:
${character.exampleDialogues}` : ''}`;

  return `${baseSystemPrompt}

${pronounInstruction}

${characterInfo}`;
}

export function buildMessages(
  chatMessages: Message[],
  character: Character,
  pronounPair: PronounPair,
  baseSystemPrompt: string
): OpenRouterMessage[] {
  const systemPrompt = buildSystemPrompt(character, pronounPair, baseSystemPrompt);
  
  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt }
  ];

  // Add first message from character if this is a new conversation
  if (chatMessages.length === 0 && character.firstMessage) {
    return messages;
  }

  // Convert chat messages to OpenRouter format
  for (const msg of chatMessages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }

  return messages;
}

export function formatMessageForDisplay(content: string): string {
  // Replace placeholder markers if any
  return content
    .replace(/\{\{user\}\}/gi, 'Bạn')
    .replace(/\{\{char\}\}/gi, 'Nhân vật');
}

// Helper to estimate token count (rough approximation)
export function estimateTokenCount(text: string): number {
  // Rough estimate: ~4 characters per token for Vietnamese/English mixed text
  return Math.ceil(text.length / 4);
}

export function truncateMessagesToFit(
  messages: OpenRouterMessage[],
  maxTokens: number
): OpenRouterMessage[] {
  // Always keep system message
  const systemMessage = messages[0];
  const chatMessages = messages.slice(1);
  
  let totalTokens = estimateTokenCount(systemMessage.content);
  const result: OpenRouterMessage[] = [systemMessage];
  
  // Add messages from the end (most recent) until we hit the limit
  const reversedChat = [...chatMessages].reverse();
  const includedChat: OpenRouterMessage[] = [];
  
  for (const msg of reversedChat) {
    const msgTokens = estimateTokenCount(msg.content);
    if (totalTokens + msgTokens > maxTokens * 0.8) { // Leave 20% for response
      break;
    }
    totalTokens += msgTokens;
    includedChat.unshift(msg);
  }
  
  return [...result, ...includedChat];
}
