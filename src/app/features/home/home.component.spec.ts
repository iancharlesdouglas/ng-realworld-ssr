import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { User } from '../../shared/model/user';
import { StateService } from '../../shared/services/state/state.service';
import { vi } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { mockHttpClient, mockHttpHandler } from '../../shared/tests/mock-http-client';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ArticleService } from '../../shared/services/article.service';
import { ArticlesApiResponse } from '../../shared/model/api/articles-api-response';
import { Article } from '../../shared/model/article';
import { environment } from '../../../environments/environment';
import { TagsApiResponse } from '../../shared/model/api/tags-api-response';
import { filterParam as filterParameter } from '../../shared/model/filter-param';
import { Feed } from '../../shared/model/feed';
import { mockIntersectionObserver } from '../../shared/tests/mock-intersection-observer';

describe('HomeComponent', () => {
	let fixture: ComponentFixture<HomeComponent>;

	beforeAll(() => {
		mockIntersectionObserver();
	});

	const setUpComponent = async ({ filter }: { filter: string }) => {
		const user: User = { username: 'x', email: 'x@y.com', token: 'some_token' };
		const stateService = new StateService();
		stateService.setUser(user);
		const router = {
			navigate: vi.fn(),
			events: of([]),
			createUrlTree: vi.fn(),
			serializeUrl: vi.fn(),
		};
		const parameters = new Map([[filterParameter, filter]]);
		await TestBed.configureTestingModule({
			imports: [HomeComponent],
			providers: [
				{ provide: ActivatedRoute, useValue: { queryParamMap: of(parameters), params: from([{ id: 'x' }]) } },
				{ provide: StateService, useValue: stateService },
				{ provide: HttpClient, useValue: mockHttpClient },
				{ provide: HttpHandler, useValue: mockHttpHandler },
				ArticleService,
				{ provide: Router, useValue: router },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeComponent);
		fixture.detectChanges();
	};

	it('shows personalised feed when the "your" filter exists in the query string', async () => {
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
			favoritesCount: 100,
		};
		const articlesResponse: ArticlesApiResponse = { articles: [article], articlesCount: 1 };
		const tagsResponse: TagsApiResponse = { tags: ['tag1', 'tag2'] };

		mockHttpClient.get = vi.fn().mockImplementation((url: string) => {
			if (url === `${environment.host}/api/tags`) {
				return of(tagsResponse);
			}
			return of(articlesResponse);
		});

		await setUpComponent({ filter: Feed.your });

		await fixture.whenStable();
		fixture.detectChanges();

		const articles = fixture.nativeElement.querySelectorAll('.article-preview') as HTMLDivElement[];
		expect(articles.length).toBe(1);

		const articleHeadings = fixture.nativeElement.querySelectorAll('.article-preview h1') as HTMLHeadingElement[];
		expect(articleHeadings.length).toBe(1);
		expect(articleHeadings[0].textContent).toEqual(article.title);
	});
});
