import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TagsApiResponse } from '../../../shared/model/api/tags-api-response';
import { ArticlesApiResponse } from '../../../shared/model/api/articles-api-response';

/**
 * Provides services to the home page
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves articles (global feed)
   * @param page Page
   * @param pageSize Page size
   * @returns Articles response object
   */
  getArticles(page: number, pageSize: number): Observable<ArticlesApiResponse> {
    const url = `${environment.host}/api/articles?offset=${page * pageSize}&limit=${pageSize}`;
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
