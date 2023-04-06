export interface RapidApiResponse {
  word: string;
  results: Result[];
  syllables: Syllables;
  pronunciation: Pronunciation;
}

export interface Pronunciation {
  all: string;
}

export interface Syllables {
  count: number;
  list: string[];
}

export interface Result {
  definition: string;
  partOfSpeech: string;
  synonyms: string[];
  typeOf: string[];
  hasTypes?: string[];
  derivation?: string[];
  examples?: string[];
}
