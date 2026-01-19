'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CommandPalette, useCommandPalette } from './index';
import { fetchSearchIndex } from '@/lib/search/buildSearchIndex';
import type { SearchItem } from '@/lib/search/searchTypes';

interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPaletteContext() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPaletteContext must be used within CommandPaletteProvider');
  }
  return context;
}

interface CommandPaletteProviderProps {
  children: ReactNode;
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const { isOpen, open, close, toggle } = useCommandPalette();
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);

  // Load search index on mount
  useEffect(() => {
    fetchSearchIndex().then(setSearchItems);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CommandPalette isOpen={isOpen} onClose={close} items={searchItems} />
    </CommandPaletteContext.Provider>
  );
}
