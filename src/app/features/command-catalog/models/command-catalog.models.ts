export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  errors: Array<{ code: string; message: string }>;
}

export interface CommandCatalogItem {
  id: string;
  projectSlug: string;
  projectName: string;
  category: string;
  command: string;
  aliases: string[];
  permission: string;
  description: string;
  usage: string;
  examples: string[];
  language: string;
  sourcePath: string;
  sortOrder: number;
  updatedAt?: string;
}

export type SortMode = 'project' | 'command' | 'permission' | 'language';

export interface CommandCatalogFilters {
  query: string;
  project: string;
  permission: string;
  language: string;
  sortMode: SortMode;
}
