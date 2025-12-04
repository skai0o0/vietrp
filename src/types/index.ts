// Character types
export interface Character {
  id: string;
  name: string;
  avatar?: string;
  persona: string;
  scenario: string;
  firstMessage: string;
  exampleDialogues: string;
  createdAt: number;
  updatedAt: number;
}

// Message types
export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  characterId?: string;
  timestamp: number;
  isEdited?: boolean;
}

// Chat/Conversation types
export interface Chat {
  id: string;
  name: string;
  characterIds: string[];
  createdAt: number;
  updatedAt: number;
  lastMessage?: string;
}

// Pronoun types for Vietnamese
export interface PronounPair {
  id: string;
  name: string;
  userPronoun: string;        // How user refers to themselves (tôi, em, anh)
  userByChar: string;         // How character calls user (bạn, anh, em)
  charPronoun: string;        // How character refers to themselves
  charByUser: string;         // How user calls character
  context: string;            // Description of when to use
}

export const DEFAULT_PRONOUN_PAIRS: PronounPair[] = [
  {
    id: 'neutral',
    name: 'Trung tính',
    userPronoun: 'tôi',
    userByChar: 'bạn',
    charPronoun: 'tôi',
    charByUser: 'bạn',
    context: 'Giao tiếp thông thường, trung tính'
  },
  {
    id: 'romantic-fm',
    name: 'Em - Anh (Nữ → Nam)',
    userPronoun: 'em',
    userByChar: 'em',
    charPronoun: 'anh',
    charByUser: 'anh',
    context: 'Quan hệ tình cảm, nữ gọi nam'
  },
  {
    id: 'romantic-mf',
    name: 'Anh - Em (Nam → Nữ)',
    userPronoun: 'anh',
    userByChar: 'anh',
    charPronoun: 'em',
    charByUser: 'em',
    context: 'Quan hệ tình cảm, nam gọi nữ'
  },
  {
    id: 'friends',
    name: 'Mình - Cậu (Bạn bè)',
    userPronoun: 'mình',
    userByChar: 'cậu',
    charPronoun: 'mình',
    charByUser: 'cậu',
    context: 'Bạn bè thân thiết'
  },
  {
    id: 'student',
    name: 'Tớ - Cậu (Học sinh)',
    userPronoun: 'tớ',
    userByChar: 'cậu',
    charPronoun: 'tớ',
    charByUser: 'cậu',
    context: 'Bạn học, học sinh'
  },
  {
    id: 'fantasy',
    name: 'Ta - Ngươi (Fantasy)',
    userPronoun: 'ta',
    userByChar: 'ngươi',
    charPronoun: 'ta',
    charByUser: 'ngươi',
    context: 'Fantasy, cổ trang, quyền lực'
  },
  {
    id: 'royal',
    name: 'Trẫm - Khanh (Hoàng gia)',
    userPronoun: 'trẫm',
    userByChar: 'bệ hạ',
    charPronoun: 'thần',
    charByUser: 'khanh',
    context: 'Vua - Thần tử'
  },
  {
    id: 'family-child',
    name: 'Con - Mẹ/Bố (Gia đình)',
    userPronoun: 'con',
    userByChar: 'con',
    charPronoun: 'mẹ',
    charByUser: 'mẹ',
    context: 'Quan hệ gia đình'
  }
];

// Settings types
export interface Settings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  pronounPairId: string;
  customPronounPair?: PronounPair;
  darkMode: boolean;
  systemPrompt: string;
}

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.8,
  maxTokens: 1024,
  topP: 1,
  pronounPairId: 'neutral',
  darkMode: true,
  systemPrompt: `Bạn là một nhân vật trong cuộc roleplay. Hãy nhập vai hoàn toàn và phản hồi một cách tự nhiên bằng tiếng Việt.

Quy tắc:
- Luôn ở trong nhân vật, không bao giờ phá vỡ vai
- Sử dụng *hành động* cho mô tả hành động và "lời nói" cho đối thoại
- Phản hồi sáng tạo và chi tiết
- Giữ nguyên cách xưng hô đã được thiết lập`
};

// Lorebook/Memory types
export interface LorebookEntry {
  id: string;
  name: string;
  keywords: string[];
  content: string;
  enabled: boolean;
  priority: number;
  chatId?: string; // If specific to a chat, otherwise global
}

// OpenRouter API types
export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Model option type
export interface ModelOption {
  id: string;
  name: string;
  contextLength: number;
  pricing: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', contextLength: 200000, pricing: '$3/$15 per 1M tokens' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', contextLength: 200000, pricing: '$0.25/$1.25 per 1M tokens' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', contextLength: 128000, pricing: '$2.50/$10 per 1M tokens' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', contextLength: 128000, pricing: '$0.15/$0.60 per 1M tokens' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', contextLength: 1000000, pricing: '$2.50/$7.50 per 1M tokens' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', contextLength: 131072, pricing: '$0.52/$0.75 per 1M tokens' },
  { id: 'mistralai/mistral-large', name: 'Mistral Large', contextLength: 128000, pricing: '$2/$6 per 1M tokens' },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', contextLength: 131072, pricing: '$0.35/$0.40 per 1M tokens' },
];
