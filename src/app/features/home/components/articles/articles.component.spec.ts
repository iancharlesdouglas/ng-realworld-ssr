import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ArticlesComponent } from "./articles.component";
import { Article } from "../../../../shared/model/article";
import { from, of } from "rxjs";
import { ActivatedRoute } from "@angular/router";

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesComponent],
      providers: [{provide: ActivatedRoute, useValue: {params: from([{id: 'x'}])}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;

     // IntersectionObserver isn't available in test environment
    class MockIntersectionObserver {
      observe() {
        return null;
      }
      unobserve() {
        return null;
      }
      disconnect() {
        return null;
      }
    }
    window.IntersectionObserver = MockIntersectionObserver;
  });

  it('shows Your Feed only when logged in', () => {
    component.signedIn = false;
    fixture.detectChanges();

    let yourFeedLink = fixture.debugElement.nativeElement.querySelector('#your-feed-link') as HTMLAnchorElement;
    expect(yourFeedLink).toBeFalsy();

    component.signedIn = true;
    fixture.detectChanges();

    yourFeedLink = fixture.debugElement.nativeElement.querySelector('#your-feed-link') as HTMLAnchorElement;
    expect(yourFeedLink).toBeDefined();
  });

  it('renders article previews', () => {
    const articles: Article[] = [{
      slug: 'article-1',
      title: 'Test Article',
      description: 'A test article',
      body: `
One writes one's test article thusly.
It is an adequate article.
      `,
      tagList: ['tag-1', 'tag-2'],
      updatedAt: new Date(),
      favorited: true,
      favoritesCount: 12,
      createdAt: new Date(),
      author: {
        username: 'A. User',
        following: true
      }
    }];
    component.articles = of(articles);
    fixture.detectChanges();

    const favoriteButton = fixture.debugElement.nativeElement.querySelectorAll('.favorite-the-article')[0] as HTMLButtonElement;
    expect(favoriteButton.textContent?.trim()).toEqual(articles[0].favoritesCount.toString());

    const articleHeader = fixture.debugElement.nativeElement.querySelectorAll('a.preview-link h1')[0] as HTMLHeadingElement;
    expect(articleHeader.textContent).toEqual(articles[0].title);

    const articleDescription = fixture.debugElement.nativeElement.querySelectorAll('a.preview-link p')[0] as HTMLParagraphElement;
    expect(articleDescription.textContent).toEqual(articles[0].description);

    const tags = fixture.debugElement.nativeElement.querySelectorAll('a.preview-link ul.tag-list li') as HTMLUListElement[];
    articles[0].tagList.forEach((tag, index) => expect(tags[index].textContent).toEqual(tag));
  });
});
