import { Injectable } from '@angular/core';
import { WidgetService } from './widget.service';
import { BehaviorSubject, catchError, tap, throwError} from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HelperService } from './helper.service';
import { AuthResponseData } from '../models/auth.model';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private widgetService: WidgetService,
    private http: HttpClient,
    private helperService: HelperService,
    private cookieService: CookieService
  ) { }

  saveCredentials(authInfo: any){
    if (authInfo.email && authInfo.password){
      localStorage.setItem('Demo-Login', JSON.stringify({'email': authInfo.email, 'password': authInfo.password}));
    }
  }

  getCredentials(){
    return JSON.parse(localStorage.getItem('Demo-Login') || '{"email": "", "password": ""}')
  }

  private async handleAuthentication(authResponse: AuthResponseData){
    const expirationDate = new Date(new Date().getTime() + (+authResponse.expiresIn * 1000));
    const user = new User(authResponse.name, authResponse.email, authResponse.localId, authResponse.idToken, expirationDate, authResponse.refreshToken)
    this.user.next(user)
    this.loggedIn.next(true)
    this.autoLogout(authResponse.expiresIn * 1000)
    localStorage.setItem('Demo-userData', JSON.stringify(user));
    this.cookieService.set('refreshToken', authResponse.refreshToken, expirationDate)
    this.helperService.navigate('/home')
    return await this.widgetService.dismissLoading();
  }

  async register(authInfo: any){
    await this.widgetService.presentLoading()
    try {
      if (authInfo.savePassword){
        this.saveCredentials(authInfo)
      }
      // register endpoint
      return this.http.post<{data: AuthResponseData}>(
        `${environment.auth_api}/register`, {
          name: authInfo.name,
          email: authInfo.email,
          password: authInfo.password
        }, {withCredentials: true}
      )
      .subscribe(async (res: any) => {
        await this.handleAuthentication(res.data)
      }, error => {
        this.handleError(error)
      })

    } catch (error: any){
      await this.widgetService.dismissLoading();
      return this.widgetService.presentAlert('An Error Occurred', error)
    }
  }

  async login(authInfo: any){
    await this.widgetService.presentLoading()
    try {
      if (authInfo.savePassword){
        this.saveCredentials(authInfo)
      }
      // register endpoint
      return this.http.post<{data: AuthResponseData}>(
        `${environment.auth_api}/login`, {
          email: authInfo.email,
          password: authInfo.password
        }//, {observe: 'response'}
      )
      .subscribe(async (res: any) => {
        await this.handleAuthentication(res.data)
      }, error => {
        this.handleError(error)
      })

    } catch (error: any){
      await this.widgetService.dismissLoading();
      return this.widgetService.presentAlert('An Error Occurred', error)
    }
  }

  async autoLogin(){
    if (!this.loggedIn.value){
      const loadedUser = this.getLoadedUser()
      if (loadedUser && loadedUser.token) { //token is null if expired by out auth logic
        this.user.next(loadedUser);
        this.loggedIn.next(true)
        const experirationDuration = new Date(loadedUser.tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(experirationDuration); //have to calculate expiration time
        return true
      }
      return false
    }
    return true
  }

  getLoadedUser(){
    const userData: {
      name: string;
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      _refreshToken: string;
    } = JSON.parse(localStorage.getItem('Demo-userData'));
    if (!userData) {
      return null;
    }
    return this.setLoadedUser(userData);
  }
  
  setLoadedUser(userData: any){
    return new User(userData.name, userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate), userData._refreshToken);
  }

  async autoLogout(expiresInIn: number){
    this.tokenExpirationTimer = setTimeout(async() => {
      this.logout();
    }, expiresInIn);
  }

  async refreshToken(): Promise<any>{
    let userData: {
      name: string;
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      _refreshToken: string;
    } = JSON.parse(localStorage.getItem('Demo-userData'));
    return await new Promise<void>((resolve, reject) => {
    this.http.get<any>(`${environment.auth_api}/refresh`)
      .toPromise()
      .then(async(res: any) => {
        const authToken = res.headers.get('Authorization')
        userData._token = authToken
        this.setLoadedUser(userData)
        resolve(authToken)
        return authToken
      }).catch((error: any) => {
        reject(error)
        return null
      })
    })
  }

  async logout(){
    await this.widgetService.presentLoading();
    return this.http.get(`${environment.auth_api}/logout`).subscribe(
      async(res:any) => {
        this.user.next(null);
        this.loggedIn.next(false);
        this.helperService.navigate('/auth')
        localStorage.removeItem('Demo-userData')
        this.cookieService.deleteAll();
        if (this.tokenExpirationTimer){
          clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null;
        return await this.widgetService.dismissLoading();
      }, async(err: any) => {
        this.handleError(err)
      }
    )
  }

  async deleteAccount(): Promise<any>{
    const action = await this.widgetService.confirmAction('Are you sure you want to delete your account. This action cannot be undone.')
    if (action === 'Complete'){
      // delete account
      await this.widgetService.presentLoading()
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.user.value.token}`,
        'Content-Type': 'application/json',
      })

      return await new Promise<void>((resolve, reject) => {
        return this.http.post<{data: AuthResponseData}>(`${environment.auth_api}/delete`, null, {headers})
          .toPromise()
          .then(async(res: any) => {
            await this.logout()
            localStorage.removeItem('Demo-Login')
            this.widgetService.presentToast("Successfully deleted user")
            return
          }).catch((error: any) => {
            reject(error)
            return this.handleError(error)
          })
        })
    }
  }

  private async handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      await this.widgetService.dismissLoading();
      return this.widgetService.presentAlert('An Error Occurred', errorMessage)
     }
     switch (errorRes.error.message) {
      case 'EMAIL_EXISTS' :
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid Password';
        break;
      case 'DEMO_ACCOUNT' :
        errorMessage = 'Demo Account cannot be deleted'
        break;
      case 'LOGOUT':
        errorMessage = 'Could not log out. Error destroying session.'
        break;
      case 'Access Denied':
        errorMessage = 'Authentication Error. Log back in and try again'
    }
    await this.widgetService.dismissLoading();
    return this.widgetService.presentAlert('An Error Occurred', errorMessage)
    //return throwError(errorMessage);
  }
}
