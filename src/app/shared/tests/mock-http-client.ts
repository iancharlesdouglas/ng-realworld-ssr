import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable, of } from "rxjs";

/**
 * Mock HTTP handler simply for injection into test modules
 */
export const mockHttpHandler: HttpHandler = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  handle(_: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of();
  },
};

/**
 * Mock HTTP client simply for injection into test modules
 */
export const mockHttpClient = new HttpClient(mockHttpHandler);
