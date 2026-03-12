export type MindNode = {
  id: string;
  label: string;
  group: 'core' | 'skill' | 'interest' | 'philosophy';
  position: [number, number, number];
  connections: string[]; // IDs of connected nodes
  description?: string;
};

export const mindMapData: MindNode[] = [
  // Core Nodes
  { id: 'core', label: 'IVAN DF', group: 'core', position: [0, 0, 0], connections: ['dev', 'design', 'life'], description: ' The Central Node.' },
  
  // Level 1 Nodes
  { id: 'dev', label: 'ENGINEERING', group: 'skill', position: [-4, 2, 0], connections: ['react', 'threejs', 'ts', 'systems'], description: 'Building robust digital architectures.' },
  { id: 'design', label: 'DESIGN', group: 'skill', position: [4, 2, 0], connections: ['uiux', 'motion', 'brand'], description: 'Crafting intuitive and beautiful experiences.' },
  { id: 'life', label: 'LIFE', group: 'philosophy', position: [0, -4, 0], connections: ['learning', 'curiosity', 'music'], description: 'Exploring the world beyond code.' },

  // Level 2 - Dev
  { id: 'react', label: 'React / Next.js', group: 'skill', position: [-6, 4, 2], connections: [], description: 'My primary tool for web applications.' },
  { id: 'threejs', label: 'Three.js / WebGL', group: 'skill', position: [-5, 1, 3], connections: [], description: 'Bringing 3D experiences to the browser.' },
  { id: 'ts', label: 'TypeScript', group: 'skill', position: [-7, 2, -2], connections: [], description: 'Ensuring type safety and code quality.' },
  { id: 'systems', label: 'System Architecture', group: 'skill', position: [-5, 5, -3], connections: [], description: 'Designing scalable and maintainable software systems.' },

  // Level 2 - Design
  { id: 'uiux', label: 'UI / UX', group: 'skill', position: [6, 4, 2], connections: [], description: 'Focusing on user-centric design principles.' },
  { id: 'motion', label: 'Motion', group: 'skill', position: [5, 1, 3], connections: [], description: 'Adding life and feedback through animation.' },
  { id: 'brand', label: 'Brand Identity', group: 'skill', position: [7, 2, -2], connections: [], description: 'Creating cohesive visual languages.' },

  // Level 2 - Life
  { id: 'learning', label: 'Continuous Learning', group: 'philosophy', position: [-2, -6, 2], connections: [], description: 'Always expanding my knowledge horizon.' },
  { id: 'curiosity', label: 'Curiosity', group: 'philosophy', position: [2, -6, 2], connections: [], description: 'The driving force behind all my work.' },
  { id: 'music', label: 'Music', group: 'interest', position: [0, -7, -3], connections: [], description: 'Finding rhythm and harmony in everything.' },
];
