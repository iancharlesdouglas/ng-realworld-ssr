import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleApiResponse } from '../model/article-api-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private readonly http: HttpClient) {}

  getArticles(): Observable<ArticleApiResponse> {
    const url = `https://api.realworld.io/api/articles?limit=5`;
    return this.http.get<ArticleApiResponse>(url);
  }
}
