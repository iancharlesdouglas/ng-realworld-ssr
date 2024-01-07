import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Profile } from "../model/profile";
import { environment } from "../../../environments/environment";
import { ProfileResponse } from "../model/api/profile-response";
import { Feed } from "../model/feed";
import { ArticlesApiResponse } from "../model/api/articles-api-response";

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

  /**
   * Retrieves articles
   * @param username Profile user name
   * @param feed Feed
   * @param page Page
   * @param pageSize Page size
   * @returns Articles response object
   */
  getArticles(username: string, feed: Feed, page: number, pageSize: number): Observable<ArticlesApiResponse> {
    console.log('getting articles for', username, feed, page);
    const userParam = feed === Feed.authored ? `author=${username}` : `favorited=${username}`;
    const url = `${environment.remoteApiHost}/api/articles?offset=${page * pageSize}&limit=${pageSize}&${userParam}`;
    return this.http.get<ArticlesApiResponse>(url);
  }
}
