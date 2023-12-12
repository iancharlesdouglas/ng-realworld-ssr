import { ArticleApiResponse } from '../../../shared/model/article-api-response';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TagsApiResponse } from '../../../shared/model/tags-api-response';

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
   * @returns Articles response object
   */
  getArticles(): Observable<ArticleApiResponse> {
    const url = `${environment.host}/api/articles`;
    return this.http.get<ArticleApiResponse>(url).pipe(take(5));
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
