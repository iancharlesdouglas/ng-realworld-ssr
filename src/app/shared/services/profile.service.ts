import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Profile } from "../model/profile";
import { environment } from "../../../environments/environment";
import { ProfileResponse } from "../model/profile-response";

/**
 * Controls access to backend services for profiles
 */
@Injectable({providedIn: 'root'})
export class ProfileService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Finds a profile by username
   * @param username Username
   * @returns Profile
   */
  find(username: string): Observable<Profile> {
    const url = `${environment.remoteApiHost}/api/profiles/${username}`;
    return this.http.get<ProfileResponse>(url).pipe(map(response => response?.profile));
  }

}
