import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Menu, RefreshCw, Loader2 } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useCharacterStore } from '../../stores/characterStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { MessageBubble } from './MessageBubble';
import { getOpenRouterService } from '../../services/openrouter';
import { buildMessages } from '../../services/promptBuilder';
import { Message } from '../../types';

interface ChatWindowProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function ChatWindow({ onToggleSidebar, sidebarOpen }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    activeChatId, 
    messages, 
    addMessage, 
    updateMessage,
    getChatMessages,
    isGenerating, 
    setGenerating,
    chats
  } = useChatStore();
  
  const { characters, selectedCharacterId, getCharacter } = useCharacterStore();
  const { settings, getPronounPair } = useSettingsStore();

  const activeChat = chats.find(c => c.id === activeChatId);
  const character = activeChat 
    ? getCharacter(activeChat.characterIds[0])
    : selectedCharacterId 
      ? getCharacter(selectedCharacterId)
      : null;
  
  const chatMessages = activeChatId ? getChatMessages(activeChatId) : [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Add first message when starting a new chat
  useEffect(() => {
    if (activeChatId && character && chatMessages.length === 0 && character.firstMessage) {
      addMessage({
        chatId: activeChatId,
        role: 'assistant',
        content: character.firstMessage,
        characterId: character.id,
      });
    }
  }, [activeChatId, character, chatMessages.length, addMessage]);

  const handleSend = async () => {
    if (!input.trim() || !activeChatId || !character || isGenerating) return;
    if (!settings.apiKey) {
      alert('Vui lòng nhập API Key trong Cài đặt');
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      chatId: activeChatId,
      role: 'user',
      content: userMessage,
    });

    // Generate AI response
    setGenerating(true);
    
    try {
      const openRouter = getOpenRouterService(settings.apiKey);
      const pronounPair = getPronounPair();
      
      // Get updated messages including the new user message
      const updatedMessages = [...chatMessages, {
        id: 'temp',
        chatId: activeChatId,
        role: 'user' as const,
        content: userMessage,
        timestamp: Date.now(),
      }];
      
      const apiMessages = buildMessages(
        updatedMessages,
        character,
        pronounPair,
        settings.systemPrompt
      );

      // Create placeholder for streaming response
      const placeholderMsg = addMessage({
        chatId: activeChatId,
        role: 'assistant',
        content: '',
        characterId: character.id,
      });

      let fullContent = '';
      
      // Use streaming
      for await (const chunk of openRouter.chatStream(apiMessages, settings.model, {
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        topP: settings.topP,
      })) {
        fullContent += chunk;
        updateMessage(placeholderMsg.id, fullContent);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      addMessage({
        chatId: activeChatId,
        role: 'assistant',
        content: `❌ Lỗi: ${error instanceof Error ? error.message : 'Không thể tạo phản hồi'}`,
        characterId: character.id,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRegenerate = async () => {
    if (!activeChatId || !character || isGenerating || chatMessages.length === 0) return;
    
    // Find last assistant message
    const lastAssistantIndex = chatMessages.map(m => m.role).lastIndexOf('assistant');
    if (lastAssistantIndex === -1) return;

    // Get messages up to (but not including) the last assistant message
    const messagesBeforeRegenerate = chatMessages.slice(0, lastAssistantIndex);
    
    setGenerating(true);
    
    try {
      const openRouter = getOpenRouterService(settings.apiKey);
      const pronounPair = getPronounPair();
      
      const apiMessages = buildMessages(
        messagesBeforeRegenerate,
        character,
        pronounPair,
        settings.systemPrompt
      );

      let fullContent = '';
      const lastAssistantMsg = chatMessages[lastAssistantIndex];
      
      for await (const chunk of openRouter.chatStream(apiMessages, settings.model, {
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        topP: settings.topP,
      })) {
        fullContent += chunk;
        updateMessage(lastAssistantMsg.id, fullContent);
      }

    } catch (error) {
      console.error('Error regenerating response:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (!character) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-xl font-semibold mb-2">Chào mừng đến với VietRP Chat</h2>
          <p className="text-surface-500 mb-4">
            Chọn một nhân vật từ sidebar để bắt đầu trò chuyện
          </p>
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Mở danh sách nhân vật
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-50 dark:bg-surface-950">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800 flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
          {character.name[0]}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">{character.name}</h2>
          <p className="text-xs text-surface-500">
            {isGenerating ? 'Đang nhập...' : 'Online'}
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isGenerating || chatMessages.length === 0}
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors disabled:opacity-50"
          title="Tạo lại phản hồi"
        >
          <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            character={msg.role === 'assistant' ? character : undefined}
          />
        ))}
        {isGenerating && chatMessages[chatMessages.length - 1]?.role === 'user' && (
          <div className="flex items-center gap-2 text-surface-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">{character.name} đang nhập...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-surface-200 dark:border-surface-800">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nhắn tin với ${character.name}...`}
            className="flex-1 px-4 py-3 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={1}
            disabled={isGenerating}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
