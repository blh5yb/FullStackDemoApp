import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Your authentication service
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const myUrls = [`${environment.auth_api}/delete`]

    let myEndpoint: boolean = false;
    for (let url of myUrls){
      if (request.url === url){
        myEndpoint = true;
      }
    }
    if (!myEndpoint && request.url.includes(`${environment.variants_api}/variants`)
      && ['POST', 'PUT', 'DELETE'].includes(request.method)){
       myEndpoint = true;
    }

    if (myEndpoint){
      return this.authService.user.pipe(
        take(1),
        exhaustMap((user) => {
          if (user) {
            request = this.addToken(request, user.token);
          }
          return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401 && !request.url.includes('refresh')) {
                return this.handle401Error(request, next);
              } else {
                return throwError(error);
              }
            })
          );
        })
      )
    } else {
      return next.handle(request)
    }
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }, withCredentials: true, 
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.authService.refreshToken().then((newToken: any) => {
        if (!newToken){
          this.authService.logout(); // Handle refresh token failure
          throw new Error('Authentication Error. Log back in and try again');
        }
        this.isRefreshing = false;
        this.refreshTokenSubject.next(newToken);
        return next.handle(this.addToken(request, newToken));
      }).catch((error: any) => {
        this.isRefreshing = false;
        this.authService.logout(); // Handle refresh token failure
        throw new Error(error);
      })
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}