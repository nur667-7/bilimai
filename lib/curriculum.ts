export const topicIds = [
  'linear',
  'inequalities',
  'systems',
  'percent',
  'probability',
  'combinatorics',
  'radicals',
  'quadratic',
  'progressions',
  'functions',
  'trigonometry',
  'derivative',
  'integrals',
  'planimetry',
  'vectors',
  'stereometry'
] as const;

export const languages = ['ru', 'uz', 'kk'] as const;
export type TopicId = typeof topicIds[number];
export type Language = typeof languages[number];
export type Locale = Language;
export const variantsPerTopic = 24;

