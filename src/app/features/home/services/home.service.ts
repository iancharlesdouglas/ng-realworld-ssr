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
    // fetch('http://localhost:4200/api/nonesuch');
    // const url = 'http://localhost:4200/api/articles';
    const url = 'http://localhost:4000/api/articles';
    // const url = `https://api.realworld.io/api/articles?limit=5`;
    return this.http.get<ArticleApiResponse>(url);
  }
}
