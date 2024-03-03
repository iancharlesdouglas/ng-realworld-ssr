import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { StateService } from './state.service';
import { User } from '../../model/user';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Persists user details to localStorage
 */
@Injectable({ providedIn: 'root' })
export class UserPersistenceService implements OnDestroy {
	private static userKey = '__realworld-user__';
	private stateSub: Subscription;
	private inBrowser;

	/**
	 * Creates a new instance that observes the given state service
	 * @param stateService State service whose user observable is watched
	 * @param platformId Platform ID to determine whether running in browser or on server
	 */
	constructor(
		private readonly stateService: StateService,
		@Inject(PLATFORM_ID) platformId: object,
	) {
		this.stateSub = this.stateService.user$.subscribe(user => this.saveUser(user));
		this.inBrowser = isPlatformBrowser(platformId);
	}

	/**
	 * Saves user details to localStorage
	 * @param user User to save
	 */
	saveUser(user: User | undefined): void {
		if (user && this.inBrowser) {
			localStorage?.setItem(UserPersistenceService.userKey, JSON.stringify(user));
		}
	}

	/**
	 * Deletes user from localStorage
	 */
	forgetUser(): void {
		if (this.inBrowser) {
			localStorage?.removeItem(UserPersistenceService.userKey);
		}
	}

	/**
	 * Loads user details from localStorage
	 * @returns User instance, or undefined if none is found
	 */
	loadUser(): User | undefined {
		if (this.inBrowser) {
			const user = localStorage?.getItem(UserPersistenceService.userKey);
			return user ? JSON.parse(user) : undefined;
		}
		return undefined;
	}

	ngOnDestroy(): void {
		this.stateSub?.unsubscribe();
	}
}
