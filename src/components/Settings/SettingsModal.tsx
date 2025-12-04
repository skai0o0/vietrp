import { useState } from 'react';
import { X, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { AVAILABLE_MODELS, DEFAULT_PRONOUN_PAIRS } from '../../types';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettingsStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'pronouns' | 'advanced'>('api');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-50 dark:bg-surface-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cài đặt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-200 dark:border-surface-700">
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'api'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-surface-600 dark:text-surface-400'
            }`}
          >
            API
          </button>
          <button
            onClick={() => setActiveTab('pronouns')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'pronouns'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-surface-600 dark:text-surface-400'
            }`}
          >
            Xưng hô
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'advanced'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-surface-600 dark:text-surface-400'
            }`}
          >
            Nâng cao
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'api' && (
            <>
              {/* API Key */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  OpenRouter API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => updateSettings({ apiKey: e.target.value })}
                    placeholder="sk-or-..."
                    className="w-full px-4 py-2 pr-10 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-surface-500"
                  >
                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-surface-500 mt-1">
                  Lấy API key tại{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={settings.model}
                  onChange={(e) => updateSettings({ model: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {AVAILABLE_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.pricing}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Giao diện tối</label>
                  <p className="text-xs text-surface-500">Chuyển đổi dark/light mode</p>
                </div>
                <button
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`p-2 rounded-lg transition-colors ${
                    settings.darkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-200 dark:bg-surface-700'
                  }`}
                >
                  {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </>
          )}

          {activeTab === 'pronouns' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cách xưng hô
                </label>
                <p className="text-xs text-surface-500 mb-4">
                  Chọn cặp đại từ nhân xưng cho cuộc trò chuyện roleplay
                </p>
                <div className="space-y-2">
                  {DEFAULT_PRONOUN_PAIRS.map((pair) => (
                    <div
                      key={pair.id}
                      onClick={() => updateSettings({ pronounPairId: pair.id })}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        settings.pronounPairId === pair.id
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{pair.name}</div>
                      <div className="text-xs text-surface-500 mt-1">
                        Bạn xưng <span className="font-medium text-primary-600">"{pair.userPronoun}"</span>, 
                        gọi nhân vật <span className="font-medium text-primary-600">"{pair.charByUser}"</span>
                        {' | '}
                        Nhân vật xưng <span className="font-medium text-primary-600">"{pair.charPronoun}"</span>, 
                        gọi bạn <span className="font-medium text-primary-600">"{pair.userByChar}"</span>
                      </div>
                      <div className="text-xs text-surface-400 mt-1 italic">{pair.context}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'advanced' && (
            <>
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-surface-500 mt-1">
                  Cao hơn = sáng tạo hơn, thấp hơn = nhất quán hơn
                </p>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Tokens: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="256"
                  value={settings.maxTokens}
                  onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-surface-500 mt-1">
                  Độ dài tối đa của phản hồi
                </p>
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  System Prompt
                </label>
                <textarea
                  value={settings.systemPrompt}
                  onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                />
                <p className="text-xs text-surface-500 mt-1">
                  Prompt cơ bản cho tất cả cuộc trò chuyện
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
