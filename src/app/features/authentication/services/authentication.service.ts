import { Injectable } from "@angular/core";
import { LoginUserRequest } from "../model/login-user-request";
import { User } from "../../../shared/model/user";
import { Observable, map, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { LoginUserResponse } from "../model/login-user-response";
import { StateService } from "../../../shared/services/state/state.service";

/**
 * Authentication service
 */
@Injectable({providedIn: 'root'})
export class AuthenticationService {
  constructor(private readonly http: HttpClient, private readonly stateService: StateService) {}

  /**
   * Gets login details and if login is successful, sets the user in application state and stores it in localStorage
   * @param loginUser User to log in
   * @returns Login user response
   */
  login(loginUser: LoginUserRequest): Observable<User> {
    const url = `${environment.remoteApiHost}/api/users/login`;
    return this.http.post<LoginUserResponse>(url, loginUser).pipe(
      map(response => response?.user),
      tap(user => this.stateService.setUser(user)));
  }
}
