/**
 * Determines whether two objects have the same property values
 * @param object1 Object 1
 * @param object2 Object 2
 * @returns True if they are naively the same
 */
export const naiveObjectComparison: <T>(object1: T, object2: T) => boolean = (object1, object2) =>
	JSON.stringify(object1) === JSON.stringify(object2);
