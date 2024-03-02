import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { mockHttpClient, mockHttpHandler } from '../../shared/tests/mock-http-client';
import { mockIntersectionObserver } from '../../shared/tests/mock-intersection-observer';
import { User } from '../../shared/model/user';
import { StateService } from '../../shared/services/state/state.service';
import { expect, vi } from 'vitest';
import { filterParam } from '../../shared/model/filter-param';
import { Feed } from '../../shared/model/feed';
import { environment } from '../../../environments/environment';
import { Article } from '../../shared/model/article';
import { ArticlesApiResponse } from '../../shared/model/api/articles-api-response';
import { ProfileResponse } from '../../shared/model/api/profile-response';
import { ProfileService } from '../../shared/services/profile.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let stateService: StateService;
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
  const articlesApiResponse: ArticlesApiResponse = {articles: [article], articlesCount: 1};
  const router = {
    navigate: vi.fn(),
    events: of([]),
    createUrlTree: vi.fn(),
    serializeUrl: vi.fn()
  };

  beforeAll(mockIntersectionObserver);

  const setUpComponent = (async (followUsername: string, loggedInUser: User | undefined) => {
    stateService = new StateService();
    stateService.setUser(loggedInUser);
    stateService.setProfilePage(0);
    const paramMap = new Map([[filterParam, Feed.authored]]);
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: from([{username: followUsername}]),
            queryParamMap: of(paramMap),
            snapshot: {url: ['/profile'], queryParams: from([{username: followUsername}])}
          }
        },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        { provide: StateService, useValue: stateService },
        ProfileService,
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should show articles for the profile feed', async () => {
    const profileUser = 'josephine_bloggs45';
    const loggedInUser: User = { username: 'peter_tinkins', email: 'x@y.com', token: 'some_token' };
    const page = 0;
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/profiles/${profileUser}`) {
        return of({profile: {username: profileUser, following: false}});
      }
      return of(articlesApiResponse);
    });
    await setUpComponent(profileUser, loggedInUser);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(mockHttpClient.get).toHaveBeenCalledWith(`${environment.remoteApiHost}/api/profiles/${profileUser}`);
    const articlesUrl = `${environment.remoteApiHost}/api/articles?offset=${page * component.pageSize}&limit=${component.pageSize}&author=${profileUser}`;
    expect(mockHttpClient.get).toHaveBeenCalledWith(articlesUrl);
  });

  it('raises a follow request when the profile is followed and the user is logged in', async () => {
    const followUser = 'josephine_bloggs45';
    const loggedInUser: User = { username: 'peter_tinkins', email: 'x@y.com', token: 'some_token' };
    const followUrl = `${environment.remoteApiHost}/api/profiles/${followUser}/follow`;
    const profileApiResponse: ProfileResponse = {profile: {username: followUser, following: false}};
    mockHttpClient.post = vi.fn().mockReturnValue(of(profileApiResponse));
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/profiles/${followUser}`) {
        return of(profileApiResponse);
      }
      return of(articlesApiResponse);
    });
    await setUpComponent(followUser, loggedInUser);
    await fixture.whenStable();
    fixture.detectChanges();

    const followButton = fixture.nativeElement.querySelector('.follow-profile-button') as HTMLButtonElement;
    followButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockHttpClient.post).toHaveBeenCalledWith(followUrl, expect.anything());
  });

  it('takes the user to the login page when the profile is followed and the user is not logged in', async () => {
    const followUser = 'josephine_bloggs45';
    const profileApiResponse: ProfileResponse = {profile: {username: followUser, following: false}};
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/profiles/${followUser}`) {
        return of(profileApiResponse);
      }
      return of(articlesApiResponse);
    });
    await setUpComponent(followUser, undefined);
    await fixture.whenStable();
    fixture.detectChanges();

    const followButton = fixture.nativeElement.querySelector('.follow-profile-button') as HTMLButtonElement;
    followButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/login'], expect.anything());
  });

  it('raises an unfollow request when the profile is unfollowed', async () => {
    const followUser = 'josephine_bloggs45';
    const loggedInUser: User = { username: 'peter_tinkins', email: 'x@y.com', token: 'some_token' };
    const followUrl = `${environment.remoteApiHost}/api/profiles/${followUser}/follow`;
    const profileApiResponse: ProfileResponse = {profile: {username: followUser, following: true}};
    mockHttpClient.delete = vi.fn().mockReturnValue(of(profileApiResponse));
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/profiles/${followUser}`) {
        return of(profileApiResponse);
      }
      return of(articlesApiResponse);
    });
    await setUpComponent(followUser, loggedInUser);
    await fixture.whenStable();
    fixture.detectChanges();

    const unfollowButton = fixture.nativeElement.querySelector('.follow-profile-button') as HTMLButtonElement;
    unfollowButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockHttpClient.delete).toHaveBeenCalledWith(followUrl);
  });
});
