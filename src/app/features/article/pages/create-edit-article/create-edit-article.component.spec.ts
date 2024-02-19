import { ArticleService } from './../../../../shared/services/article.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditArticleComponent } from './create-edit-article.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { from, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { StateService } from '../../../../shared/services/state/state.service';
import { User } from '../../../../shared/model/user';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { vi } from 'vitest';

describe('CreateEditArticleComponent', () => {
  let component: CreateEditArticleComponent;
  let fixture: ComponentFixture<CreateEditArticleComponent>;

  beforeEach(async () => {
    const user: User = { username: 'x', email: 'x@y.com', token: 'some_token' };
    const stateService = new StateService();
    stateService.setUser(user);
    const router = {
      navigate: vi.fn()
    };
      await TestBed.configureTestingModule({
      imports: [CreateEditArticleComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {params: from([{id: ''}])} },
        { provide: StateService, useValue: stateService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: HttpHandler, useValue: mockHttpHandler },
        ArticleService,
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve an existing article as per the URL parameter', () => {
  });

  it('should post an article when a new one is published', () => {
    const title = 'Test Article';
    const description = 'Test article description';
    const body = 'Test article body';
    const tagList: string[] = [];
    const articleRequest = {
      title,
      description,
      body,
      tagList,
      slug: ''
    };

    mockHttpClient.post = vi.fn().mockReturnValue(of(articleRequest));

    const titleInput = fixture.nativeElement.querySelector('input[formControlName=title]') as HTMLInputElement;
    titleInput.value = title;
    titleInput.dispatchEvent(new Event('input'));

    const descriptionInput = fixture.nativeElement.querySelector('input[formControlName=description]') as HTMLInputElement;
    descriptionInput.value = description;
    descriptionInput.dispatchEvent(new Event('input'));

    const bodyTextArea = fixture.nativeElement.querySelector('textarea[formControlName=body]') as HTMLTextAreaElement;
    bodyTextArea.value = body;
    bodyTextArea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const publishButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    publishButton.click();

    const expectedUrl = `${environment.remoteApiHost}/api/articles/`;

    expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, {article: articleRequest});
  });

  it('should add a tag when one is typed in', () => {
    throw 'not implemented';
  });
});
