
import React from 'react';
import { CategoryKey } from './types';

interface CategoryInfo {
  key: CategoryKey;
  name: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Record<Exclude<CategoryKey, CategoryKey.FAVORITES>, CategoryInfo> = {
  [CategoryKey.FAIRY_TALES]: {
    key: CategoryKey.FAIRY_TALES,
    name: 'Παραμύθια',
    color: 'bg-pink-400',
    hoverColor: 'hover:bg-pink-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  [CategoryKey.MUSIC]: {
    key: CategoryKey.MUSIC,
    name: 'Μουσική',
    color: 'bg-blue-400',
    hoverColor: 'hover:bg-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    ),
  },
  [CategoryKey.EDUCATIONAL]: {
    key: CategoryKey.EDUCATIONAL,
    name: 'Εκπαιδευτικά',
    color: 'bg-green-400',
    hoverColor: 'hover:bg-green-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  [CategoryKey.CARTOONS]: {
    key: CategoryKey.CARTOONS,
    name: 'Κινούμενα Σχέδια',
    color: 'bg-orange-400',
    hoverColor: 'hover:bg-orange-500',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
       </svg>
    ),
  },
  [CategoryKey.MOVIES]: {
    key: CategoryKey.MOVIES,
    name: 'Ταινίες',
    color: 'bg-yellow-400',
    hoverColor: 'hover:bg-yellow-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  [CategoryKey.SERIES]: {
    key: CategoryKey.SERIES,
    name: 'Σειρές',
    color: 'bg-purple-400',
    hoverColor: 'hover:bg-purple-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
};