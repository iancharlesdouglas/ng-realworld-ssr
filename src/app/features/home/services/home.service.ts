import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TagsApiResponse } from '../../../shared/model/api/tags-api-response';
import { ArticlesApiResponse } from '../../../shared/model/api/articles-api-response';
import { Feed } from '../../../shared/model/feed';

/**
 * Provides services to the home page
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves articles
   * @param feed Feed
   * @param page Page
   * @param pageSize Page size
   * @returns Articles response object
   */
  getArticles(feed: Feed, page: number, pageSize: number): Observable<ArticlesApiResponse> {
    const host = feed === Feed.global ? environment.host : environment.remoteApiHost;
    console.log('getting articles for feed', feed);
    const url = `${host}/api/articles?offset=${page * pageSize}&limit=${pageSize}`;
    return this.http.get<ArticlesApiResponse>(url);
  }

  /**
   * Retrieves all tags
   * @returns Tags response object
   */
  getTags(): Observable<TagsApiResponse> {
    const url = `${environment.host}/api/tags`;
    return this.http.get<TagsApiResponse>(url);
  }
}
