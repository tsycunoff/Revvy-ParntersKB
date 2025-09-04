import type React from 'react';

export interface ContentBlock {
  type: 'heading' | 'paragraph';
  content: string;
}

export interface Page {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface Section {
  id:string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  pages: Page[];
}

export type KnowledgeBase = Section[];