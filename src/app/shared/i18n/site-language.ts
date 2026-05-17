export type SiteLanguageCode =
  | 'english'
  | 'french'
  | 'german'
  | 'spanish'
  | 'brazilian'
  | 'schinese'
  | 'italian'
  | 'hungarian'
  | 'japanese'
  | 'koreana'
  | 'polish'
  | 'russian'
  | 'turkish'
  | 'tchinese'
  | 'thai'
  | 'ukrainian';

export interface SiteLanguageOption {
  code: SiteLanguageCode;
  displayName: string;
}

export const SITE_LANGUAGE_OPTIONS: readonly SiteLanguageOption[] = [
  { code: 'english', displayName: 'English' },
  { code: 'french', displayName: 'Français' },
  { code: 'german', displayName: 'Deutsch' },
  { code: 'spanish', displayName: 'Español (España)' },
  { code: 'brazilian', displayName: 'Português (Brasil)' },
  { code: 'schinese', displayName: '简体中文' },
  { code: 'italian', displayName: 'Italiano' },
  { code: 'hungarian', displayName: 'Magyar' },
  { code: 'japanese', displayName: '日本語' },
  { code: 'koreana', displayName: '한국어' },
  { code: 'polish', displayName: 'Polski' },
  { code: 'russian', displayName: 'Русский' },
  { code: 'turkish', displayName: 'Türkçe' },
  { code: 'tchinese', displayName: '繁體中文' },
  { code: 'thai', displayName: 'ไทย' },
  { code: 'ukrainian', displayName: 'Українська' },
] as const;

const LANGUAGE_ALIASES = new Map<string, SiteLanguageCode>([
  ['english', 'english'],
  ['en', 'english'],
  ['en-us', 'english'],
  ['french', 'french'],
  ['fr', 'french'],
  ['fr-fr', 'french'],
  ['german', 'german'],
  ['de', 'german'],
  ['de-de', 'german'],
  ['spanish', 'spanish'],
  ['es', 'spanish'],
  ['es-es', 'spanish'],
  ['latam', 'spanish'],
  ['brazilian', 'brazilian'],
  ['portuguese', 'brazilian'],
  ['pt-br', 'brazilian'],
  ['pt_br', 'brazilian'],
  ['ptbr', 'brazilian'],
  ['schinese', 'schinese'],
  ['zh-cn', 'schinese'],
  ['zh_cn', 'schinese'],
  ['chinesesimplified', 'schinese'],
  ['italian', 'italian'],
  ['it', 'italian'],
  ['it-it', 'italian'],
  ['hungarian', 'hungarian'],
  ['hu', 'hungarian'],
  ['hu-hu', 'hungarian'],
  ['japanese', 'japanese'],
  ['ja', 'japanese'],
  ['ja-jp', 'japanese'],
  ['koreana', 'koreana'],
  ['korean', 'koreana'],
  ['ko', 'koreana'],
  ['ko-kr', 'koreana'],
  ['polish', 'polish'],
  ['pl', 'polish'],
  ['pl-pl', 'polish'],
  ['russian', 'russian'],
  ['ru', 'russian'],
  ['ru-ru', 'russian'],
  ['turkish', 'turkish'],
  ['tr', 'turkish'],
  ['tr-tr', 'turkish'],
  ['tchinese', 'tchinese'],
  ['zh-tw', 'tchinese'],
  ['zh_tw', 'tchinese'],
  ['chinesetraditional', 'tchinese'],
  ['thai', 'thai'],
  ['th', 'thai'],
  ['th-th', 'thai'],
  ['ukrainian', 'ukrainian'],
  ['uk', 'ukrainian'],
  ['uk-ua', 'ukrainian'],
]);

export function normalizeSiteLanguageCode(value: string | null | undefined, fallback: SiteLanguageCode = 'english'): SiteLanguageCode {
  if (!value) {
    return fallback;
  }

  return LANGUAGE_ALIASES.get(value.trim().toLowerCase()) ?? fallback;
}
