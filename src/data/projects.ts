// projects.ts

import { Project } from '@/types/project';

export const PROJECTS: Project[] = [
  // ----------------------------------------------------------------------
  // DEV PROJECTS
  // ----------------------------------------------------------------------
  {
    id: 'rick-and-morty-theme',
    title: 'Rick and Morty Theme',
    description: 'A scientifically accurate VS Code theme. Features "Portal Gun Dark" & "Citadel Light".',
    category: 'DEV',
    tags: ['VS Code', 'Theme', 'Design System'],
    year: '2023',
    links: {
      repo: 'https://github.com/ivandf/rick-and-morty-theme',
      marketplace: 'https://marketplace.visualstudio.com/items?itemName=idf-studio.rick-and-morty-theme'
    },
    media: {
      thumbnail: '/projects/rick-and-morty/thumb.jpg', 
      gallery: ['/projects/rick-and-morty/dark.png', '/projects/rick-and-morty/light.png']
    },
    interaction: 'glitch',
    layout: 'featured'
  },
  {
    id: 'check-your-pipes',
    title: 'Check Your Pipes',
    description: 'Minimal, terminal-style Azure DevOps pipeline monitor for VS Code.',
    category: 'DEV',
    tags: ['VS Code Extension', 'TypeScript', 'Azure DevOps'],
    year: '2023',
    links: {
      repo: 'https://github.com/IvanDF/check-your-pipes'
    },
    media: {
      thumbnail: '/projects/check-your-pipes/thumb.jpg'
    },
    interaction: 'spotlight'
  },

  // ----------------------------------------------------------------------
  // MAKER / DESIGN
  // ----------------------------------------------------------------------
  {
    id: 'gwent-cards',
    title: 'Real Life Gwent',
    description: 'Physical recreation of The Witcher 3 Gwent decks. High-res asset extraction & print design.',
    category: 'MAKER',
    tags: ['Print Design', 'Prop Making', 'The Witcher'],
    year: '2022',
    media: {
      thumbnail: '/projects/gwent/thumb.jpg'
    },
    interaction: 'tilt',
    layout: 'tall'
  },
  {
    id: 'cosplay-business-cards',
    title: 'Cosplay Branding',
    description: 'Custom character-specific business cards (Pokémon, Yu-Gi-Oh!) for cosplayers.',
    category: 'DESIGN',
    tags: ['Graphic Design', 'Branding', 'Print'],
    year: '2022',
    media: {
      thumbnail: '/projects/business-cards/thumb.jpg'
    },
    interaction: 'tilt'
  },

  // ----------------------------------------------------------------------
  // EXPERIMENTS
  // ----------------------------------------------------------------------
  {
    id: 'genji-ai',
    title: 'Genji.ai',
    description: 'Experimental generative interface concept.',
    category: 'EXPERIMENT',
    tags: ['AI', 'Generative', 'Concept'],
    year: '2023',
    media: {
      thumbnail: '/projects/genji/thumb.jpg'
    },
    interaction: 'glitch',
    layout: 'wide'
  }
];
