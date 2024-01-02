import { User } from '../../model/user';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { State, initialState } from "../../model/state";
import { deepFreeze } from './util/deep-freeze';
import { Store } from './store';
import { select$ } from './util/select';
import { Feed } from '../../model/feed';

/**
 * State service
 */
@Injectable({providedIn: 'root'})
export class StateService {
  private state$: Store<State>;
  private lastState: State;

  /**
   * User observable
   */
  user$: Observable<User | undefined>;

  /**
   * Articles page no. observable
   */
  page$: Observable<number>;

  /**
   * Home page feed
   */
  homePageFeed$: Observable<Feed | undefined>;

  /**
   * Creates a new instance
   */
  constructor() {
    this.state$ = new Store(initialState);
    this.lastState = initialState;
    this.user$ = select$(this.state$, state => state.user);
    this.page$ = select$(this.state$, state => state.page);
    this.homePageFeed$ = select$(this.state$, state => state.homePageFeed);
  }

  /**
   * Sets the state (deep freezes it first)
   * @param state State to set
   */
  setState(state: State): void {
    this.state$.next(deepFreeze(state));
    this.lastState = state;
  }

  /**
   * Sets the page in the state
   * @param page Page
   */
  async setPage(page: number): Promise<void> {
    this.setState({...this.lastState, page});
  }

  /**
   * Sets the user in the state
   * @param user User
   * @returns New state
   */
  async setUser(user: User | undefined): Promise<State> {
    const newState = {...this.lastState, user};
    this.setState(newState);
    return newState;
  }

  /**
   * Sets the home page feed
   * @param homePageFeed Home page feed
   */
  async setHomePageFeed(homePageFeed: Feed | undefined): Promise<void> {
    this.setState({...this.lastState, homePageFeed});
  }

  /**
   * Returns the last user
   * @returns Last user state
   */
  getLastUser(): User | undefined {
    return this.lastState.user;
  }
}
