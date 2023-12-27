import { Injectable, OnDestroy } from "@angular/core";
import { StateService } from "./state.service";
import { User } from "../../model/user";
import { Subscription } from "rxjs";

/**
 * Persists user details to localStorage
 */
@Injectable({ providedIn: 'root' })
export class UserPersistenceService implements OnDestroy {
  private static userKey = '__realworld-user__';
  private stateSub: Subscription;

  /**
   * Creates a new instance that observes the given state service
   * @param stateService State service whose user observable is watched
   */
  constructor(private readonly stateService: StateService) {
    this.stateSub = this.stateService.user$.subscribe(user => this.saveUser(user));
  }

  /**
   * Saves user details to localStorage
   * @param user User to save
   */
  saveUser(user: User | undefined): void {
    if (user) {
      localStorage?.setItem(UserPersistenceService.userKey, JSON.stringify(user));
    }
  }

  /**
   * Deletes user from localStorage
   */
  deleteUser(): void {
    localStorage?.removeItem(UserPersistenceService.userKey);
  }

  /**
   * Loads user details from localStorage
   * @returns User instance, or undefined if none is found
   */
  loadUser(): User | undefined {
    const user = localStorage?.getItem(UserPersistenceService.userKey);
    return user ? JSON.parse(user) : undefined;
  }

  ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
  }
}
