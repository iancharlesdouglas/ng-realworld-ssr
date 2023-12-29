import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { StateService } from "../services/state/state.service";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

/**
 * Intercepts HTTP requests and adds a token if the user has been logged in
 * @param request Request
 * @param next Next handler
 * @returns Next result
 */
export const jwtInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const user = inject(StateService).getLastUser();
  if (user) {
    request = request.clone({
      setHeaders: { Authorization: `Token ${user.token}`}
    });
  }
  return next(request);
};
