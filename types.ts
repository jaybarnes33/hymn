interface HymnContent {
  title: string;
  content: string[][];
}

export interface Hymn {
  number: string;
  twi: HymnContent;
  english: HymnContent;
}
