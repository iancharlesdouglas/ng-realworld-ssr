import { BehaviorSubject } from "rxjs";
import { deepFreeze } from "./util/deep-freeze";
import { naiveObjectComparison } from "./util/naive-object-comparison";

/**
 * State store
 */
export class Store<T extends object> extends BehaviorSubject<T> {
  constructor(initial: T) {
    super(deepFreeze(initial));
  }

  /**
   * Supply new value to the store
   * @param newData New value
   */
  override next(newData: T): void {
    const frozen = deepFreeze(newData);
    if (!naiveObjectComparison(frozen, this.getValue())) {
      super.next(frozen);
    }
  }
}
