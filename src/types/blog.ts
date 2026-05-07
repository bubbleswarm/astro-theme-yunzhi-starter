export interface BlogPost {
  id: string;
  slug?: string;
  hash?: string;
  data: {
    title: string;
    description: string;
    pubDate: number;
    updatedDate?: number;
    category?: string;
    tags: string[];
    heroImage?: string;
    draft?: boolean;
    summary?: string;
    schemaType?: 'blog' | 'faq';
    faq?: Array<{ question: string; answer: string }>;
  };
  body?: string;
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

export interface BlogTag {
  name: string;
  count: number;
}

export interface Moment {
  id: string;
  data: {
    pubDate: number;
  };
  body?: string;
}
