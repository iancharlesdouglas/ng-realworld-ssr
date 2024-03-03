import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../../shared/model/article';
import { EMPTY, Observable } from 'rxjs';
import { User } from '../../../../shared/model/user';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Comment } from '../../../../shared/model/comment';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentToAdd } from '../../model/comment-to-add';
import { CommentToDelete } from '../../model/comment-to-delete';

/**
 * Comments on an article, including feature to add a comment
 */
@Component({
	selector: 'app-article-comments',
	standalone: true,
	imports: [AsyncPipe, DatePipe, FormsModule, ReactiveFormsModule, RouterLink],
	templateUrl: './article-comments.component.html',
})
export class ArticleCommentsComponent {
	@Input() article: Article | undefined;
	@Input() comments$: Observable<Comment[]> = EMPTY;
	@Input() user$: Observable<User | undefined> = EMPTY;
	@Output() addComment = new EventEmitter<CommentToAdd>();
	@Output() deleteComment = new EventEmitter<CommentToDelete>();

	formGroup: FormGroup;

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({ comment: ['', Validators.required] });
	}

	/**
	 * Emits an addComment event with the comment body
	 */
	postComment(): void {
		this.addComment.emit({ article: this.article!, comment: this.formGroup.get('comment')?.value?.trim() });
	}

	/**
	 * Emits a deleteComment event for an article comment
	 * @param comment Comment
	 */
	removeComment(comment: Comment): void {
		this.deleteComment.emit({ article: this.article!, comment });
	}
}
