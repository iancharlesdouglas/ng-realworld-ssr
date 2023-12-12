import { ArticleApiResponse } from './../model/article-api-response';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
   * Retrieves full list of articles (global feed)
   * @returns Articles response object
   */
  getArticlesFull(): Observable<ArticleApiResponse> {
    const url = 'https://api.realworld.io/api/articles?limit=20';
    return this.http.get<ArticleApiResponse>(url);
  }
}
