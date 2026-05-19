export interface NeighborhoodScores {
  walkability?: number;
  transitAccess?: number;
  foodScene?: number;
  coffeeShops?: number;
  outdoorSpaces?: number;
  nightlife?: number;
  familyFriendly?: number;
  culturalDiversity?: number;
  affordability?: number;
  quietResidential?: number;
  [key: string]: number | undefined;
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface Gap {
  text: string;
  isMustHave: boolean;
}

export interface PhraseChip {
  category: string;
  phrase: string;
  score: number;
  weight: PriorityLabel;
}

export interface MatchResult {
  id: string;
  name: string;
  tagline: string;
  cityName: string;
  matchPercent: number;
  rawScore: number;
  insightLine: string;
  phraseChips: PhraseChip[];
  gaps: Gap[];
  rentRange: string;
  walkScore: number;
  highlights: string[];
  bestFor: string[];
  coords: Coords;
  scores: NeighborhoodScores;
}

export interface Place {
  name: string;
  lat?: number;
  lng?: number;
  rating?: number;
  reviews?: number;
  address?: string;
  open?: boolean | null;
}

export type PriorityLabel = 'must-have' | 'important' | 'nice-to-have';

export interface UserPriorities {
  [category: string]: PriorityLabel;
}
