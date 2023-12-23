import { naiveObjectComparison } from "./naive-object-comparison";

/**
 * Mapper function
 */
export type Mapper<T, R> = (mappable: T) => R;

/**
 * Memoizable comparator function
 */
export type Memoizable<R> = (previous: R, current: R) => boolean;

/**
 * Default memoizable function, which uses naiveObjectComparison
 * @param previous Previous value
 * @param current Current value
 * @returns True if the values match
 * @see naiveObjectComparison
 */
export const defaultMemoizable = <R>(previous: R, current: R) => {
  if (typeof previous === 'object' && typeof current === 'object') {
    return naiveObjectComparison(previous, current);
  }
  return previous === current;
};
