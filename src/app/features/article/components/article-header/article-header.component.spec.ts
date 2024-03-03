import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleHeaderComponent } from './article-header.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { DateTime } from 'luxon';
import { Article } from '../../../../shared/model/article';

describe('ArticleHeaderComponent', () => {
	let component: ArticleHeaderComponent;
	let fixture: ComponentFixture<ArticleHeaderComponent>;

	const article: Article = {
		slug: 'article-id',
		title: 'Article Title',
		description: '',
		body: 'Article body',
		tagList: [],
		createdAt: DateTime.fromISO('2023-10-01').toJSDate(),
		updatedAt: DateTime.fromISO('2023-10-02').toJSDate(),
		favorited: true,
		favoritesCount: 1000,
		author: {
			username: 'Author-1',
			image: 'https://some-image-source/author-image.png',
			following: false,
		},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ArticleHeaderComponent],
			providers: [{ provide: ActivatedRoute, useValue: { params: from([{ id: 'x' }]) } }],
		}).compileComponents();

		fixture = TestBed.createComponent(ArticleHeaderComponent);
		component = fixture.componentInstance;
		component.article = article;
		fixture.detectChanges();
	});

	it('should render the article title', () => {
		const h1 = fixture.nativeElement.querySelector('h1');
		expect(h1.textContent).toEqual(article.title);
	});

	it('should render the article summary details', () => {
		const pathPrefix = '.banner .container .article-meta';
		const authorImage = fixture.nativeElement.querySelector(`${pathPrefix} .author-image img`) as HTMLImageElement;
		expect(authorImage.src).toEqual(article.author.image!);
		expect(authorImage.alt).toEqual(`Image of ${article.author.username}`);

		const authorNameLink = fixture.nativeElement.querySelector(`${pathPrefix} .author-name`) as HTMLAnchorElement;
		expect(authorNameLink.textContent).toEqual(article.author.username);

		const createdDate = fixture.nativeElement.querySelector(`${pathPrefix} .date`) as HTMLSpanElement;
		expect(createdDate.textContent).toEqual(DateTime.fromJSDate(article.createdAt).toFormat('LLLL dd yyyy'));
	});
});
