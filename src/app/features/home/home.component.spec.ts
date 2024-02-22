import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { User } from "../../shared/model/user";
import { StateService } from "../../shared/services/state/state.service";
import { vi } from "vitest";
import { ActivatedRoute, Router } from "@angular/router";
import { from, of } from "rxjs";
import { mockHttpClient, mockHttpHandler } from "../../shared/tests/mock-http-client";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { ArticleService } from "../../shared/services/article.service";
import { ArticlesApiResponse } from "../../shared/model/api/articles-api-response";
import { Article } from "../../shared/model/article";
import { environment } from "../../../environments/environment";
import { TagsApiResponse } from "../../shared/model/api/tags-api-response";
import { filterParam } from "../../shared/model/filter-param";
import { Feed } from "../../shared/model/feed";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const setUpComponent = async ({filter}: {filter: string}) => {
    const user: User = { username: 'x', email: 'x@y.com', token: 'some_token' };
    const stateService = new StateService();
    stateService.setUser(user);
    const router = {
      navigate: vi.fn(),
    };
    const params = new Map([[filterParam, filter]]);
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {queryParamMap: of(params)} },
        { provide: StateService, useValue: stateService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        ArticleService,
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('shows personalised feed when the "your" filter exists in the query string', () => {
    const article: Article = {
      slug: 'article-123',
      title: 'An article',
      description: 'An article of some sort',
      body: 'Lorem ipsum tacitus',
      tagList: ['tag1'],
      author: { username: 'joebloggs1', following: false },
      createdAt: new Date(),
      updatedAt: new Date(),
      favorited: false,
      favoritesCount: 100
     };
    const articlesResponse: ArticlesApiResponse = {articles: [article], articlesCount: 1};
    const tagsResponse: TagsApiResponse = {tags: ['tag1', 'tag2']};

    mockHttpClient.get = vi.fn().mockImplementation((url: string) => {
      if (url === `${environment.host}/api/tags`) {
        return of(tagsResponse);
      } else {
        return of(articlesResponse);
      }
    });

    setUpComponent({filter: Feed.your});

    component.ngOnInit();

  });
});
