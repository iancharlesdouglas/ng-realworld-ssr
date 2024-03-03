/**
 * Freezes an object and all of its child objects recursively
 * @param inObject Object to freeze
 * @returns Frozen object
 * @see object.freeze
 */
export const deepFreeze = <T extends object>(inObject: T) => {
	Object.freeze(inObject);
	for (const [key, value] of Object.entries(inObject)) {
		if (
			Object.prototype.hasOwnProperty.call(inObject, key) &&
			value != undefined &&
			typeof value === 'object' &&
			!Object.isFrozen(value)
		) {
			deepFreeze(value);
		}
	}
	return inObject;
};
