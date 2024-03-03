import { Routes } from '@angular/router';

/**
 * Route mappings to components
 */
export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./features/home/home.component').then(comp => comp.HomeComponent),
	},
	{
		path: 'article/:id',
		loadComponent: () =>
			import('./features/article/pages/article/article.component').then(comp => comp.ArticleComponent),
	},
	{
		path: 'editor/:id',
		loadComponent: () =>
			import('./features/article/pages/create-edit-article/create-edit-article.component').then(
				comp => comp.CreateEditArticleComponent,
			),
	},
	{
		path: 'editor',
		loadComponent: () =>
			import('./features/article/pages/create-edit-article/create-edit-article.component').then(
				comp => comp.CreateEditArticleComponent,
			),
	},
	{
		path: 'login',
		loadComponent: () => import('./features/user/pages/login/login.component').then(comp => comp.LoginComponent),
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./features/user/pages/register/register.component').then(comp => comp.RegisterComponent),
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('./features/user/pages/settings/settings.component').then(comp => comp.SettingsComponent),
	},
	{
		path: 'profile/:username',
		loadComponent: () => import('./features/profile/profile.component').then(comp => comp.ProfileComponent),
	},
];
