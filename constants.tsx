
import React from 'react';
import { DSATopic } from './types';

export const DSA_TOPICS: DSATopic[] = [
  { id: 'arrays', title: 'Arrays & Strings', description: 'Basic blocks of DSA', icon: '📊' },
  { id: 'linkedlists', title: 'Linked Lists', description: 'Nodes and pointers', icon: '🔗' },
  { id: 'trees', title: 'Trees & BST', description: 'Hierarchical structures', icon: '🌳' },
  { id: 'graphs', title: 'Graphs', description: 'Nodes and edges', icon: '🕸️' },
  { id: 'dp', title: 'Dynamic Programming', description: 'Optimization problems', icon: '🧠' },
  { id: 'sorting', title: 'Sorting & Searching', description: 'Algorithmic efficiency', icon: '🔍' },
];

export const SYSTEM_INSTRUCTION = `You are a world-class Data Structures and Algorithms (DSA) expert and tutor.
Your goal is to help students understand complex concepts with clarity, provide clean and efficient code examples, and explain time and space complexity (Big O notation).

When responding:
1. Use Markdown for formatting.
2. Use code blocks with appropriate language tags (python, java, cpp, javascript).
3. Break down complex logic into step-by-step explanations.
4. Suggest optimizations where possible.
5. If the user asks for a solution to a problem, explain the intuition before showing the code.
6. Use a professional yet encouraging tone.`;
