export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  errors: Array<{ code: string; message: string }>;
}

export interface CommandCatalogItem {
  id: string;
  commandKey?: string;
  projectSlug: string;
  projectName: string;
  audience?: CommandAudience;
  variantLabel?: string;
  isAdminVariant?: boolean;
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
  isInternalPlugin?: boolean;
  updatedAt?: string;
}

export type CommandAudience = 'player' | 'admin';
export type SortMode = 'project' | 'command';
export type ViewMode = 'grid' | 'list';

export interface CommandCatalogFilters {
  query: string;
  project: string;
  permission: string;
  sortMode: SortMode;
}

export function resolveCommandAudience(command: CommandCatalogItem): CommandAudience {
  return isAdminAudienceVariant(command) ? 'admin' : 'player';
}

export function isAdminAudienceVariant(command: CommandCatalogItem): boolean {
  return command.isAdminVariant === true
    || normalizeCommandAudience(command.audience) === 'admin'
    || normalizeCommandAudience(command.variantLabel) === 'admin'
    || normalizeCommandAudience(command.category) === 'admin';
}

export function normalizeCommandAudience(value: string | null | undefined): CommandAudience | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'admin' || normalized === 'player') {
    return normalized;
  }

  return null;
}
