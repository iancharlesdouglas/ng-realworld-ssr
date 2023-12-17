import { Injectable } from "@angular/core";
import { Article } from "../model/article";
import { Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ArticleApiResponse } from "../model/article-api-response";

@Injectable({providedIn: 'root'})
export class ArticleService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a single article from the remote API endpoint
   * @param slug Article slug (ID)
   * @returns Article
   */
  getArticle(slug: string): Observable<Article> {
    const { remoteApiHost } = environment;
    return this.http.get<ArticleApiResponse>(`${remoteApiHost}/api/articles/${slug}`).pipe(map(response => response.article));
  }
}
