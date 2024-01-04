/**
 * Feed type
 */
export enum Feed {
  global = 'global',
  your = 'your',
  authored = 'authored',
  favorited = 'favorited',
  tag = 'tag'
}

/**
 * Active feed
 */
export type ActiveFeed = {
  feed: Feed,
  tag?: string
};
