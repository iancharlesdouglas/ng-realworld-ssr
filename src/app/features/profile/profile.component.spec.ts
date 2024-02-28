import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { ActivatedRoute } from '@angular/router';
import { from, of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { mockHttpClient, mockHttpHandler } from '../../shared/tests/mock-http-client';
import { mockIntersectionObserver } from '../../shared/tests/mock-intersection-observer';
import { User } from '../../shared/model/user';
import { StateService } from '../../shared/services/state/state.service';
import { vi } from 'vitest';
import { filterParam } from '../../shared/model/filter-param';
import { Feed } from '../../shared/model/feed';
import { environment } from '../../../environments/environment';
import { Article } from '../../shared/model/article';
import { ArticleApiResponse } from '../../shared/model/api/article-api-response';
import { ArticlesApiResponse } from '../../shared/model/api/articles-api-response';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeAll(mockIntersectionObserver);

  const setUpComponent = (async (username: string) => {
    const user: User = { username: 'peter_tinkins', email: 'x@y.com', token: 'some_token' };
    const stateService = new StateService();
    stateService.setUser(user);
    stateService.setProfilePage(0);
    const router = {
      navigate: vi.fn(),
      events: of([]),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn()
    };
    const paramMap = new Map([[filterParam, Feed.authored]]);
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {params: from([{username}]), queryParamMap: of(paramMap)} },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should show articles for the profile feed', async () => {
    const username = 'josephine_bloggs45';
    const page = 0;
    const article: Article = {
      slug: '123',
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum tacitus atsale',
      body: 'Lorem ipsum tamantes tacistus ipto decitus maxi.',
      tagList: [],
      author: {
        username: 'joebloggs25',
        following: false
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      favorited: false,
      favoritesCount: 100
    };
    const apiResponse: ArticlesApiResponse = {articles: [article], articlesCount: 1};
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/profiles/${username}`) {
        return of({profile: {username, following: false}});
      }
      return of(apiResponse);
    });
    await setUpComponent(username);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(mockHttpClient.get).toHaveBeenCalledWith(`${environment.remoteApiHost}/api/profiles/${username}`);
    const articlesUrl = `${environment.remoteApiHost}/api/articles?offset=${page * component.pageSize}&limit=${component.pageSize}&author=${username}`;
    expect(mockHttpClient.get).toHaveBeenCalledWith(articlesUrl);
  });

  // it('should set the page in state when a page is selected', () => {

  // });

  // it('should raise a follow request when the profile is followed', () => {

  // });

  // it('should raise an unfollow request when the profile is unfollowed', () => {

  // });
});
