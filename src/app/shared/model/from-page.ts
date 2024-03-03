import { Params, UrlSegment } from '@angular/router';

/**
 * Navigation from-page information so app. can navigate user back to where they came from
 */
export type FromPage = {
	url: UrlSegment[];
	queryParams: Params;
};
