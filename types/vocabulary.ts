// types/index.ts

// --- CONSTANTS & ENUMS ---

export const PART_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'phrase',
  'other',
] as const;

export type PartOfSpeech = (typeof PART_OF_SPEECH)[number];

export const WORD_LEVELS = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
] as const;

export type WordLevel = (typeof WORD_LEVELS)[number];

export const WORD_STATUSES = [
  'new',
  'learning',
  'known',
] as const;

export type WordStatus = (typeof WORD_STATUSES)[number];


// --- TOPIC TYPES ---

export type Topic = {
  _id: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
};

export type TopicPreview = Pick<
    Topic,
    '_id' | 'title' | 'color' | 'icon'
>;

export type CreateTopicInput = {
  title: string;
  description?: string;
  color?: string;
  icon?: string;
};

export type TopicsResponse = {
  topics: Topic[];
};


// --- WORD TYPES ---

export interface WordMeaning {
  _id?: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  example?: string;
  exampleTranslation?: string;
}

export type Word = {
  _id: string;
  word: string;
  transcription?: string;
  meanings: WordMeaning[];
  level: WordLevel;
  topics: string[];
  isFavorite: boolean;
  status: WordStatus;
  createdAt: string;
  updatedAt?: string;
};

export type WordWithTopics = Omit<Word, 'topics'> & {
  topics: TopicPreview[];
};

export type CreateWordInput = {
  word: string;
  transcription?: string;
  meanings: WordMeaning[];
  level?: WordLevel;
  topics?: string[];
  isFavorite?: boolean;
  status?: WordStatus;
};

export type WordsResponse = {
  words: WordWithTopics[];
  total: number;
};