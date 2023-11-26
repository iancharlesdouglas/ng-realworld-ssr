import { TestBed } from '@angular/core/testing';
import { HomeService } from './home.service';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import { ArticleApiResponse } from '../model/article-api-response';

describe('HomeService', () => {
  let service: HomeService;

  const httpHandler: HttpHandler = {
    handle(_: HttpRequest<any>): Observable<HttpEvent<any>> {
      return of();
    },
  };
  const httpClient = new HttpClient(httpHandler);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClient,
        },
        { provide: HttpHandler, useValue: httpHandler },
      ],
    });
    vi.spyOn(httpClient, 'get');
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns articles when the getArticles method is called', async () => {
    const expectedArticles: ArticleApiResponse = {
      articlesCount: 1,
      articles: [
        {
          title: 'Web Frameworks According to ChatGPT 3.5',
          description:
            'A summary of leading web frameworks according to ChatGPT 3.5, prompted to write a scathing though knowledgeable overview',
          body: `
Ah, the web frameworks, those self-proclaimed virtuosos of digital creation. Let's dissect this ensemble of tools, shall we?

React, the darling of Facebook, a declarative "efficiency" supposedly masking its virtual DOM charade. The initial load performance is, of course, tolerable, as long as you don't mind the orchestra of dependencies and the developer acrobatics required to optimize those components.

Angular, the Google-born TypeScript-based juggernaut. Its initial bundle, a veritable elephant in the room. Sure, it offers Ahead-of-Time compilation and lazy loading, but one wonders if the weight is worth the purported benefits. A symphony of features, but at what cost to the user's patience?
`,
          slug: 'web-frameworks-chatgpt-scathingly',
          tagList: ['webframeworks', 'frameworks', 'chatgpt', 'ai'],
          createdAt: new Date('2023-11-26T13:33:02'),
          updatedAt: new Date('2023-11-26T13:33:02'),
          author: { username: 'iandouglas', following: true },
          favorited: true,
          favoritesCount: 2,
        },
      ],
    };
    vi.spyOn(httpClient, 'get').mockReturnValue(of(expectedArticles));
    const articles$ = service.getArticles();
    const articlesResponse = await firstValueFrom(articles$);

    expect(httpClient.get).toHaveBeenCalled();
    expect(articlesResponse.articles.length).toBe(1);
  });
});
