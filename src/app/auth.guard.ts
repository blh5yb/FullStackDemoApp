import { Injectable } from '@angular/core';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    //private afAuth: AngularFireAuth, 
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.autoLogin().then((loggedIn: boolean) => {
        if (loggedIn){
          return true
        } else {
          return this.router.createUrlTree(['/auth/signin'])
        }
      })
      return this.authService.loggedIn.pipe(map(isAuth => {
        if (isAuth){
          return true;
        }
        return this.router.createUrlTree(['/auth/signin'])
      }))
      //return this.afAuth.authState.pipe(map(user => {
      //  const isAuth = true // !!user;
      //  if (isAuth){
      //    return true
      //  }
      //  return this.router.createUrlTree(['/auth'])
      //}))
  }
}
