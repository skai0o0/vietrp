import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  messages: Message[];
  activeChatId: string | null;
  isGenerating: boolean;
  
  // Chat actions
  createChat: (characterIds: string[], name?: string) => Chat;
  deleteChat: (id: string) => void;
  setActiveChat: (id: string | null) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  
  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
  getChatMessages: (chatId: string) => Message[];
  clearChatMessages: (chatId: string) => void;
  
  // Generation state
  setGenerating: (isGenerating: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      messages: [],
      activeChatId: null,
      isGenerating: false,
      
      createChat: (characterIds, name) => {
        const newChat: Chat = {
          id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: name || `Chat ${get().chats.length + 1}`,
          characterIds,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          chats: [...state.chats, newChat],
          activeChatId: newChat.id
        }));
        
        return newChat;
      },
      
      deleteChat: (id) => set((state) => ({
        chats: state.chats.filter(chat => chat.id !== id),
        messages: state.messages.filter(msg => msg.chatId !== id),
        activeChatId: state.activeChatId === id ? null : state.activeChatId
      })),
      
      setActiveChat: (id) => set({ activeChatId: id }),
      
      updateChat: (id, updates) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === id ? { ...chat, ...updates, updatedAt: Date.now() } : chat
        )
      })),
      
      addMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };
        
        set((state) => {
          // Update chat's lastMessage
          const updatedChats = state.chats.map(chat => 
            chat.id === messageData.chatId 
              ? { ...chat, lastMessage: newMessage.content.substring(0, 100), updatedAt: Date.now() }
              : chat
          );
          
          return {
            messages: [...state.messages, newMessage],
            chats: updatedChats
          };
        });
        
        return newMessage;
      },
      
      updateMessage: (id, content) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === id ? { ...msg, content, isEdited: true } : msg
        )
      })),
      
      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter(msg => msg.id !== id)
      })),
      
      getChatMessages: (chatId) => {
        return get().messages.filter(msg => msg.chatId === chatId);
      },
      
      clearChatMessages: (chatId) => set((state) => ({
        messages: state.messages.filter(msg => msg.chatId !== chatId)
      })),
      
      setGenerating: (isGenerating) => set({ isGenerating }),
    }),
    {
      name: 'vietrp-chats',
    }
  )
);
