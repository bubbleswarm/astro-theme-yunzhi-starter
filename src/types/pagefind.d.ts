export interface PagefindSearchResult {
  data(): Promise<{
    url: string;
    meta: {
      title: string;
    };
    excerpt: string;
  }>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
}

export interface PagefindAPI {
  search(query: string): Promise<PagefindSearchResponse>;
}

declare module '*/pagefind/pagefind.js' {
  const pagefind: PagefindAPI;
  export default pagefind;
}
