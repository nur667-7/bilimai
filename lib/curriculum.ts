export const topicIds = ['linear', 'percent', 'probability', 'quadratic', 'progressions', 'functions', 'trigonometry', 'derivative', 'planimetry', 'stereometry'] as const;
export const languages = ['ru', 'uz', 'kk'] as const;
export type TopicId = typeof topicIds[number];
export type Language = typeof languages[number];
export const variantsPerTopic = 24;
