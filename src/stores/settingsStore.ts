import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, DEFAULT_SETTINGS, PronounPair, DEFAULT_PRONOUN_PAIRS } from '../types';

interface SettingsState {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  getPronounPair: () => PronounPair;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      setApiKey: (key) => set((state) => ({
        settings: { ...state.settings, apiKey: key }
      })),
      
      setModel: (model) => set((state) => ({
        settings: { ...state.settings, model }
      })),
      
      getPronounPair: () => {
        const { settings } = get();
        if (settings.customPronounPair) {
          return settings.customPronounPair;
        }
        return DEFAULT_PRONOUN_PAIRS.find(p => p.id === settings.pronounPairId) || DEFAULT_PRONOUN_PAIRS[0];
      },
      
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'vietrp-settings',
    }
  )
);
