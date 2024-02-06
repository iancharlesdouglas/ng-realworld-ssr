import { Injectable } from "@angular/core";
import { Article } from "../model/article";
import { Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ArticleApiResponse } from "../model/api/article-api-response";
import { CreateEditArticle } from "../model/create-edit-article";

/**
 * Controls access to backend services for articles
 */
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

  /**
   * Favorites an article
   * @param article Article
   * @returns Article
   */
  favoriteArticle(article: Article): Observable<Article> {
    const { remoteApiHost } = environment;
    return this.http.post<ArticleApiResponse>(`${remoteApiHost}/api/articles/${article.slug}/favorite`, {}).pipe(map(response => {
      return response.article;
    }));
  }

  /**
   * Unfavorites an article
   * @param article Article
   * @returns Article
   */
  unfavoriteArticle(article: Article): Observable<Article> {
    const { remoteApiHost } = environment;
    return this.http.delete<ArticleApiResponse>(`${remoteApiHost}/api/articles/${article.slug}/favorite`).pipe(map(response => response.article));
  }

  /**
   * Creates an article
   * @param article Article
   * @returns Created article
   */
  createArticle(article: CreateEditArticle): Observable<Article> {
    const { remoteApiHost } = environment;
    return this.http.post<ArticleApiResponse>(`${remoteApiHost}/api/articles/`, {article}).pipe(map(response => {
      return response.article;
    }));
  }

  /**
   * Updates an article
   * @param article Article
   * @returns Updated article
   */
  updateArticle(article: CreateEditArticle): Observable<Article> {
    const { remoteApiHost } = environment;
    return this.http.put<ArticleApiResponse>(`${remoteApiHost}/api/articles/${article.slug}`, {article}).pipe(map(response => {
      return response.article;
    }));
  }

  /**
   * Deletes an article
   * @param article Article
   * @returns Result
   */
  deleteArticle(article: CreateEditArticle): Observable<unknown> {
    const { remoteApiHost } = environment;
    return this.http.delete(`${remoteApiHost}/api/articles/${article.slug}`);
  }
}
