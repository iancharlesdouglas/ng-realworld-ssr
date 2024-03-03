import { ArticleService } from './../../../../shared/services/article.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditArticleComponent } from './create-edit-article.component';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { StateService } from '../../../../shared/services/state/state.service';
import { User } from '../../../../shared/model/user';
import { mockHttpClient, mockHttpHandler } from '../../../../shared/tests/mock-http-client';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { vi } from 'vitest';
import { CreateEditArticle } from '../../../../shared/model/create-edit-article';

describe('CreateEditArticleComponent', () => {
	let fixture: ComponentFixture<CreateEditArticleComponent>;

	const setUpComponent = async (slug = '') => {
		const user: User = { username: 'x', email: 'x@y.com', token: 'some_token' };
		const stateService = new StateService();
		stateService.setUser(user);
		const router = {
			navigate: vi.fn(),
		};
		await TestBed.configureTestingModule({
			imports: [CreateEditArticleComponent],
			providers: [
				{ provide: ActivatedRoute, useValue: { params: from([{ id: slug }]) } },
				{ provide: StateService, useValue: stateService },
				{ provide: HttpClient, useValue: mockHttpClient },
				{ provide: HttpHandler, useValue: mockHttpHandler },
				ArticleService,
				{ provide: Router, useValue: router },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CreateEditArticleComponent);
		fixture.detectChanges();
	};

	it('should post an article to the server when a new one is published', async () => {
		await setUpComponent();
		const title = 'Test Article';
		const description = 'Test article description';
		const body = 'Test article body';
		const tagList: string[] = [];
		const article: CreateEditArticle = {
			title,
			description,
			body,
			tagList,
			slug: '',
		};

		mockHttpClient.post = vi.fn().mockReturnValue(of(article));

		const titleInput = fixture.nativeElement.querySelector('input[formControlName=title]') as HTMLInputElement;
		titleInput.value = title;
		titleInput.dispatchEvent(new Event('input'));

		const descriptionInput = fixture.nativeElement.querySelector(
			'input[formControlName=description]',
		) as HTMLInputElement;
		descriptionInput.value = description;
		descriptionInput.dispatchEvent(new Event('input'));

		const bodyTextArea = fixture.nativeElement.querySelector('textarea[formControlName=body]') as HTMLTextAreaElement;
		bodyTextArea.value = body;
		bodyTextArea.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		const publishButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
		publishButton.click();

		const expectedUrl = `${environment.remoteApiHost}/api/articles/`;

		expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, { article });
	});

	it('should put an article on the server when an existing one is updated', async () => {
		const slug = 'test-article-123';
		await setUpComponent(slug);
		const title = 'Test Article';
		const description = 'Test article description';
		const body = 'Test article body';
		const tagList: string[] = [];
		const article: CreateEditArticle = {
			title,
			description,
			body,
			tagList,
			slug,
		};

		mockHttpClient.put = vi.fn().mockReturnValue(of(article));

		const titleInput = fixture.nativeElement.querySelector('input[formControlName=title]') as HTMLInputElement;
		titleInput.value = title;
		titleInput.dispatchEvent(new Event('input'));

		const descriptionInput = fixture.nativeElement.querySelector(
			'input[formControlName=description]',
		) as HTMLInputElement;
		descriptionInput.value = description;
		descriptionInput.dispatchEvent(new Event('input'));

		const bodyTextArea = fixture.nativeElement.querySelector('textarea[formControlName=body]') as HTMLTextAreaElement;
		bodyTextArea.value = body;
		bodyTextArea.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		const publishButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
		publishButton.click();

		const expectedUrl = `${environment.remoteApiHost}/api/articles/${slug}`;

		expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, { article });
	});

	it('should add a tag when one is typed in', async () => {
		await setUpComponent();
		const tag = 'cool';

		const tagInput = fixture.nativeElement.querySelector('input[formControlName=tag]') as HTMLInputElement;
		tagInput.value = tag;
		tagInput.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		const tagSpan = fixture.nativeElement.querySelector('span.tag-pill') as HTMLSpanElement;
		expect(tagSpan).toBeDefined();
	});
});
