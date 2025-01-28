import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap, throwError, timer } from 'rxjs';
import { AuthResponseData } from '../models/auth.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor(
    private http: HttpClient
  ) { }

  asyncCheckEmail = (control: AbstractControl): Observable<ValidationErrors | HttpErrorResponse | null> => {
    return this.http.get(
      `${environment.auth_api}/check-email/${control.value}`
    ).pipe(debounceTime(2000),
      map((res: any) => {
        return (res && res.data && control.value) ? {codeUnAvail: true} : null;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    )
  }

  asyncEmailControl (): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return timer(1000).pipe(
        switchMap(() => {
          if (!control.value){
            return of(null);
          }
          const email = control.value
          return this.http.get(
            `${environment.auth_api}/check-email/${email}`
          )
          .pipe(debounceTime(3000),
            map((res: any) => {
              return (res && res.data && email) ? {codeUnAvail: true} : null;
            }),
            catchError(() => of(null))
          )
        })
      )
    }
  }
}
