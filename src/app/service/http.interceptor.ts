import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from the cookie
    const authToken = this.cookieService.get('authToken');
    //Clone the request to add the Authorization header
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });
    }

    // Pass the request to the next handler
    return next.handle(req);
  }
}
