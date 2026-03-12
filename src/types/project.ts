export type ProjectCategory = 'DEV' | 'DESIGN' | 'MAKER' | 'EXPERIMENT';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  year: string;
  links?: {
    demo?: string;
    repo?: string;
    marketplace?: string;
    caseStudy?: string;
  };
  media: {
    thumbnail: string; // Path relative to public (e.g., "/projects/my-project/thumb.jpg")
    gallery?: string[];
  };
  interaction?: 'glitch' | 'tilt' | 'spotlight';
  layout?: 'tall' | 'wide' | 'featured';
}
