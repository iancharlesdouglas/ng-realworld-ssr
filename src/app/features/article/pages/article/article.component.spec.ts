import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { EMPTY, from, of } from 'rxjs';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { ArticleComponent } from './article.component';
import { User } from '../../../../shared/model/user';
import { StateService } from '../../../../shared/services/state/state.service';
import { expect, vi } from 'vitest';
import { ArticleService } from '../../../../shared/services/article.service';
import { environment } from '../../../../../environments/environment';
import { Article } from '../../../../shared/model/article';
import { Comment } from '../../../../shared/model/comment';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  const setUpComponent = async (slug = '') => {
    const user: User = { username: 'x', email: 'x@y.com', token: 'some_token' };
    const stateService = new StateService();
    stateService.setUser(user);
    const router = {
      navigate: vi.fn(),
      events: of([]),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {params: from([{id: slug}])} },
        { provide: StateService, useValue: stateService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        ArticleService,
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
  };

  it('should retrieve an article with its comments', async () => {
    const slug = '123';
    const article: Article = {
      slug,
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
    const comments: Comment[] = [
      {
        id: 1_000_001,
        body: 'Great article!',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          username: 'jimtibbs22',
          following: false
        }
      }
    ];
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/articles/${slug}`) {
        return of({article});
      }
      return of({comments});
    });

    await setUpComponent(slug);
    await fixture.whenStable();
    fixture.detectChanges();

    const bodyParagraph = fixture.nativeElement.querySelector('.article-content') as HTMLParagraphElement;
    expect(bodyParagraph.textContent).toEqual(article.body);

    const commentsSection = fixture.nativeElement.querySelector('.comments') as HTMLDivElement;
    expect(commentsSection).toBeDefined();
    const commentParagraphs = fixture.nativeElement.querySelectorAll('.comments .card.comment p.card-text') as HTMLParagraphElement[];
    expect(commentParagraphs.length).toBe(comments.length);
    expect(commentParagraphs[0].textContent?.trim()).toEqual(comments[0].body);
  });

  it('should favorite an article when requested', async () => {
    const slug = '1234';
    const article: Article = {
      slug,
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
      favoritesCount: 101
    };
    mockHttpClient.post = vi.fn().mockReturnValue(of(article));
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/articles/${slug}`) {
        return of({article});
      }
      return of([]);
    });
    await setUpComponent(slug);
    await fixture.whenStable();
    fixture.detectChanges();

    const favoriteControl = fixture.nativeElement.querySelector('.favorite-control') as HTMLButtonElement;
    favoriteControl.click();

    expect(mockHttpClient.post).toHaveBeenCalledWith(`${environment.remoteApiHost}/api/articles/${article.slug}/favorite`, expect.anything());
  });

  it('should unfavorite an article when requested', async () => {
    const slug = '1234';
    const article: Article = {
      slug,
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
      favorited: true,
      favoritesCount: 101
    };
    mockHttpClient.delete = vi.fn().mockReturnValue(of(article));
    mockHttpClient.get = vi.fn().mockImplementation(url => {
      if (url === `${environment.remoteApiHost}/api/articles/${slug}`) {
        return of({article});
      }
      return of([]);
    });
    await setUpComponent(slug);
    await fixture.whenStable();
    fixture.detectChanges();

    const favoriteControl = fixture.nativeElement.querySelector('.favorite-control') as HTMLButtonElement;
    favoriteControl.click();

    expect(mockHttpClient.delete).toHaveBeenCalledWith(`${environment.remoteApiHost}/api/articles/${article.slug}/favorite`);
  });

  // it('should action following of an author when requested', () => {
  //   throw 'not implemented';
  // });

  // it('should navigate to the edit link when requested', () => {

//   });
});
