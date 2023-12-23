/**
 * Freezes an object and all of its child objects recursively
 * @param inObject Object to freeze
 * @returns Frozen object
 * @see object.freeze
 */
export const deepFreeze = <T extends object>(inObject: T) => {
  Object.freeze(inObject);
  Object.entries(inObject).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(inObject, key) && value != null && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return inObject;
};
