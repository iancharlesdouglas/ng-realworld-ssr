import { Injectable } from '@angular/core';
import { LoginUserRequest } from './model/login-user-request';
import { User } from '../../../shared/model/user';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StateService } from '../../../shared/services/state/state.service';
import { RegisterUserRequest } from './model/register-user-request';
import { UserResponse } from '../../../shared/model/api/user-response';

/**
 * Authentication (login and registration) service
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(
		private readonly http: HttpClient,
		private readonly stateService: StateService,
	) {}

	/**
	 * Attempts to log the user in and if successful, sets the user in application state
	 * @param loginUser User to log in
	 * @returns Login user response
	 */
	login(loginUser: LoginUserRequest): Observable<User> {
		const url = `${environment.remoteApiHost}/api/users/login`;
		return this.http.post<UserResponse>(url, loginUser).pipe(
			map(response => response?.user),
			tap(user => this.stateService.setUser(user)),
		);
	}

	/**
	 * Attempts to register a user and if successful, sets the user in application state
	 * @param registerUser User to register
	 * @returns User registration response
	 */
	register(registerUser: RegisterUserRequest): Observable<User> {
		const url = `${environment.remoteApiHost}/api/users`;
		return this.http.post<UserResponse>(url, registerUser).pipe(
			map(response => response?.user),
			tap(user => this.stateService.setUser(user)),
		);
	}
}
