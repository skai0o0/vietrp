# 🎭 VietRP Chat - AI Roleplay Tiếng Việt

Ứng dụng chat AI roleplay tiếng Việt đơn giản, sử dụng mô hình BYOK (Bring Your Own Key) với OpenRouter API.

## 📋 Tổng quan

VietRP Chat là phiên bản đơn giản hóa của SillyTavern, được thiết kế đặc biệt cho người dùng Việt Nam với:
- Hỗ trợ đại từ nhân xưng tiếng Việt (em/anh, tôi/bạn, ta/ngươi...)
- Giao diện tiếng Việt hoàn toàn
- BYOK - Người dùng tự cung cấp API key (OpenRouter)
- Lưu trữ dữ liệu local (không cần backend server)

---

## 🏗️ Cấu trúc dự án

```
vietrp-chat/
├── public/                     # Static assets
├── src/
│   ├── components/             # React Components
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx  # Cửa sổ chat chính
│   │   │   └── MessageBubble.tsx # Bong bóng tin nhắn
│   │   ├── Layout/
│   │   │   └── Sidebar.tsx     # Sidebar navigation
│   │   └── Settings/
│   │       └── SettingsModal.tsx # Modal cài đặt
│   ├── services/               # Business Logic
│   │   ├── openrouter.ts       # OpenRouter API client
│   │   └── promptBuilder.ts    # Xây dựng prompt với đại từ
│   ├── stores/                 # State Management (Zustand)
│   │   ├── chatStore.ts        # Quản lý chats & messages
│   │   ├── characterStore.ts   # Quản lý nhân vật
│   │   └── settingsStore.ts    # Quản lý cài đặt
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🧩 Chi tiết từng module

### 1. **Types** (`src/types/index.ts`)

Định nghĩa tất cả interfaces chính:

| Interface | Mô tả |
|-----------|-------|
| `Character` | Thông tin nhân vật (name, persona, scenario, firstMessage, exampleDialogues) |
| `Message` | Tin nhắn (role, content, characterId, timestamp) |
| `Chat` | Cuộc trò chuyện (characterIds, messages) |
| `PronounPair` | Cặp đại từ nhân xưng tiếng Việt |
| `Settings` | Cài đặt ứng dụng (apiKey, model, temperature, pronounPairId) |

**Dữ liệu mẫu:**
- `DEFAULT_PRONOUN_PAIRS`: 8 cặp đại từ có sẵn (em-anh, tôi-bạn, ta-ngươi, trẫm-khanh...)
- `AVAILABLE_MODELS`: Danh sách model OpenRouter (Claude, GPT-4, Llama, Gemini...)
- `DEFAULT_SETTINGS`: Cài đặt mặc định

---

### 2. **Stores** (State Management với Zustand)

#### `settingsStore.ts`
```typescript
// Trạng thái
settings: Settings          // Cài đặt hiện tại

// Actions
updateSettings(updates)     // Cập nhật cài đặt
setApiKey(key)              // Đặt API key
setModel(model)             // Đổi model
getPronounPair()            // Lấy cặp đại từ đang dùng
resetSettings()             // Reset về mặc định
```

#### `characterStore.ts`
```typescript
// Trạng thái
characters: Character[]           // Danh sách nhân vật
selectedCharacterId: string|null  // Nhân vật đang chọn

// Actions
addCharacter(character)     // Thêm nhân vật
updateCharacter(id, updates)// Cập nhật nhân vật
deleteCharacter(id)         // Xóa nhân vật
selectCharacter(id)         // Chọn nhân vật
getCharacter(id)            // Lấy thông tin nhân vật
importCharacter(data)       // Import từ JSON
```

**Sample Characters có sẵn:**
- Sakura - Cô gái sinh viên dịu dàng
- Long Vương - Thần rồng cổ đại

#### `chatStore.ts`
```typescript
// Trạng thái
chats: Chat[]               // Danh sách chat
messages: Message[]         // Tất cả tin nhắn
activeChatId: string|null   // Chat đang active
isGenerating: boolean       // Đang tạo response?

// Actions
createChat(characterIds)    // Tạo chat mới
deleteChat(id)              // Xóa chat
setActiveChat(id)           // Chuyển chat
addMessage(message)         // Thêm tin nhắn
updateMessage(id, content)  // Sửa tin nhắn
deleteMessage(id)           // Xóa tin nhắn
getChatMessages(chatId)     // Lấy tin nhắn của chat
clearChatMessages(chatId)   // Xóa hết tin nhắn
setGenerating(bool)         // Đặt trạng thái generating
```

---

### 3. **Services** (Business Logic)

#### `openrouter.ts` - OpenRouter API Client

```typescript
class OpenRouterService {
  // Chat thường (chờ response hoàn chỉnh)
  async chat(messages, model, options): Promise<OpenRouterResponse>
  
  // Chat streaming (trả về từng chunk)
  async *chatStream(messages, model, options): AsyncGenerator<string>
}

// Factory function
getOpenRouterService(apiKey): OpenRouterService
```

#### `promptBuilder.ts` - Xây dựng Prompt

```typescript
// Tạo system prompt với thông tin nhân vật + đại từ
buildSystemPrompt(character, pronounPair, basePrompt): string

// Chuyển đổi messages sang format OpenRouter
buildMessages(chatMessages, character, pronounPair, basePrompt): OpenRouterMessage[]

// Ước tính token count
estimateTokenCount(text): number

// Cắt bớt messages để vừa context window
truncateMessagesToFit(messages, maxTokens): OpenRouterMessage[]
```

---

### 4. **Components** (UI)

#### `App.tsx`
- Root component
- Quản lý dark mode
- Hiển thị Settings modal khi chưa có API key

#### `Sidebar.tsx`
- 2 tabs: Chats & Nhân vật
- Tạo/Xóa/Chọn chat
- Chọn nhân vật để bắt đầu chat

#### `ChatWindow.tsx`
- Header với thông tin nhân vật
- Danh sách tin nhắn
- Input để gửi tin nhắn
- Nút regenerate response
- Tự động scroll xuống cuối
- Hiển thị trạng thái đang nhập

#### `MessageBubble.tsx`
- Hiển thị tin nhắn với avatar
- Markdown rendering
- Edit/Delete tin nhắn
- Phân biệt user vs assistant

#### `SettingsModal.tsx`
- **Tab API**: API key, Model selection, Dark mode toggle
- **Tab Xưng hô**: Chọn cặp đại từ nhân xưng
- **Tab Nâng cao**: Temperature, Max tokens, System prompt

---

## 🚀 Hướng dẫn sử dụng

### Cài đặt
```bash
cd vietrp-chat
npm install
```

### Chạy development
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS |
| State | Zustand (với persist middleware) |
| Icons | Lucide React |
| Markdown | react-markdown + remark-gfm |
| Storage | LocalStorage (tự động persist) |
| API | OpenRouter |

---

## 📝 Luồng hoạt động

### Gửi tin nhắn:
```
1. User nhập tin nhắn → handleSend()
2. addMessage() → Lưu user message vào store
3. setGenerating(true)
4. buildMessages() → Tạo prompt với:
   - System prompt cơ bản
   - Thông tin nhân vật (persona, scenario)
   - Quy tắc đại từ nhân xưng
   - Lịch sử chat
5. chatStream() → Gọi OpenRouter API (streaming)
6. Từng chunk → updateMessage() → Cập nhật UI realtime
7. Hoàn thành → setGenerating(false)
```

### Đại từ nhân xưng:
```
1. User chọn cặp đại từ trong Settings
2. Khi build prompt, inject vào system prompt:
   "User tự xưng: 'em', gọi nhân vật 'anh'
    Nhân vật tự xưng: 'anh', gọi user 'em'"
3. AI roleplay theo đúng cách xưng hô đã định
```

---

## 🗂️ Data Persistence

Tất cả dữ liệu được lưu trong **localStorage**:

| Key | Data |
|-----|------|
| `vietrp-settings` | API key, model, temperature, pronounPairId, darkMode |
| `vietrp-characters` | Danh sách nhân vật |
| `vietrp-chats` | Danh sách chat + messages |

---

## 🔜 Roadmap phát triển

- [ ] **Phase 2**: Character Card system (import/export PNG, editor UI)
- [ ] **Phase 3**: Enhanced Chat (token counter, message bookmarks)
- [ ] **Phase 4**: Group Chat (nhiều nhân vật trong 1 chat)
- [ ] **Phase 5**: Memory/Lorebook (keyword-based context injection)
- [ ] **Phase 6**: Deploy to Vercel, mobile responsive

---

## 📄 License

MIT License

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/TenTinhNang`)
3. Commit changes (`git commit -m 'Add TenTinhNang'`)
4. Push to branch (`git push origin feature/TenTinhNang`)
5. Tạo Pull Request

---

## 📞 Liên hệ

Nếu có câu hỏi về cấu trúc code hoặc cần hỗ trợ, hãy tạo Issue trên repository.
