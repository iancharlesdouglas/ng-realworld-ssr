import { Observable, distinctUntilChanged, map, shareReplay } from "rxjs";
import { Mapper, Memoizable, defaultMemoizable } from "./memoizable";

/**
 * Selector which maps the source using the given mapper, memoizes the result using the given function (or default) and returning the mapped observable
 * @param source$ Source observable
 * @param mapper Map function
 * @param memoizable Memoizable function (optional)
 * @returns Mapped observable
 */
export const select$ = <T, R>(source$: Observable<T>, mapper: Mapper<T, R>, memoizable: Memoizable<R> = defaultMemoizable<R>) => {
  return source$.pipe(
    map(mapper),
    distinctUntilChanged(memoizable),
    shareReplay(1)
  )
};
