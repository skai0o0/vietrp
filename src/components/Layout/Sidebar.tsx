import { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useCharacterStore } from '../../stores/characterStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ isOpen, onToggle, onOpenSettings }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'characters'>('chats');
  const { chats, activeChatId, setActiveChat, createChat, deleteChat } = useChatStore();
  const { characters, selectedCharacterId, selectCharacter } = useCharacterStore();

  const handleNewChat = () => {
    if (selectedCharacterId) {
      createChat([selectedCharacterId]);
    }
  };

  const handleSelectCharacter = (charId: string) => {
    selectCharacter(charId);
    // Check if there's an existing chat with this character
    const existingChat = chats.find(chat => 
      chat.characterIds.length === 1 && chat.characterIds[0] === charId
    );
    if (existingChat) {
      setActiveChat(existingChat.id);
    } else {
      // Create new chat with this character
      createChat([charId]);
    }
  };

  if (!isOpen) {
    return (
      <div className="w-12 bg-surface-100 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col items-center py-4 gap-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={() => { onToggle(); setActiveTab('chats'); }}
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
        >
          <MessageSquare size={20} />
        </button>
        <button
          onClick={() => { onToggle(); setActiveTab('characters'); }}
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
        >
          <Users size={20} />
        </button>
        <div className="flex-1" />
        <button
          onClick={onOpenSettings}
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-surface-100 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
          🎭 VietRP Chat
        </h1>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-surface-200 dark:hover:bg-surface-800 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-800">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'chats'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
          }`}
        >
          <MessageSquare size={16} className="inline mr-1" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'characters'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
          }`}
        >
          <Users size={16} className="inline mr-1" />
          Nhân vật
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <div className="p-2">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              disabled={!selectedCharacterId}
              className="w-full mb-2 px-3 py-2 flex items-center gap-2 text-sm bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Chat mới
            </button>

            {/* Chat List */}
            {chats.length === 0 ? (
              <p className="text-center text-surface-500 text-sm py-4">
                Chưa có cuộc trò chuyện nào
              </p>
            ) : (
              <div className="space-y-1">
                {chats.map(chat => {
                  const character = characters.find(c => c.id === chat.characterIds[0]);
                  return (
                    <div
                      key={chat.id}
                      className={`group px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                        activeChatId === chat.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-surface-200 dark:hover:bg-surface-800'
                      }`}
                      onClick={() => setActiveChat(chat.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center text-sm font-medium">
                        {character?.name[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {character?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-surface-500 truncate">
                          {chat.lastMessage || 'Bắt đầu trò chuyện...'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {/* Character List */}
            {characters.length === 0 ? (
              <p className="text-center text-surface-500 text-sm py-4">
                Chưa có nhân vật nào
              </p>
            ) : (
              <div className="space-y-1">
                {characters.map(char => (
                  <div
                    key={char.id}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                      selectedCharacterId === char.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-surface-200 dark:hover:bg-surface-800'
                    }`}
                    onClick={() => handleSelectCharacter(char.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                      {char.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{char.name}</p>
                      <p className="text-xs text-surface-500 truncate">
                        {char.persona.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-surface-200 dark:border-surface-800">
        <button
          onClick={onOpenSettings}
          className="w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
        >
          <Settings size={16} />
          Cài đặt
        </button>
      </div>
    </div>
  );
}
