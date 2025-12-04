import { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Message, Character } from '../../types';
import { useChatStore } from '../../stores/chatStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
  character?: Character;
}

export function MessageBubble({ message, character }: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { updateMessage, deleteMessage } = useChatStore();

  const isUser = message.role === 'user';

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updateMessage(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
      deleteMessage(message.id);
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium ${
        isUser 
          ? 'bg-surface-300 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
          : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
      }`}>
        {isUser ? '👤' : character?.name[0] || '?'}
      </div>

      {/* Message Content */}
      <div className={`group flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name & Time */}
        <div className={`flex items-center gap-2 mb-1 text-xs text-surface-500 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium">{isUser ? 'Bạn' : character?.name || 'AI'}</span>
          <span>{new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          {message.isEdited && <span className="italic">(đã sửa)</span>}
        </div>

        {/* Bubble */}
        <div className={`relative rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-surface-200 dark:bg-surface-800 rounded-tl-sm'
        }`}>
          {isEditing ? (
            <div className="min-w-[200px]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-transparent border-none resize-none focus:outline-none min-h-[60px]"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-black/10 rounded"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-1 hover:bg-black/10 rounded"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="message-content prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isEditing && (
          <div className={`flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-surface-200 dark:hover:bg-surface-700 rounded text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
              title="Sửa"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-surface-500 hover:text-red-500"
              title="Xóa"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
