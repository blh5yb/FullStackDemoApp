import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from './services/helper.service';
import { NavigationStart, Router } from '@angular/router';
import { catchError, map, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {

  appPages: any[] = [
    {title: 'Contact', url: '/contact', icon: 'mail'},
    {title: 'SIGN IN', url: ''}
  ]
  curr_page!: string
  route_sub!: Subscription

  constructor(
    private helperService: HelperService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnDestroy(): void {
      
  }

  async testHttpReq(){
    //return this.http.get(`http://localhost:3001`, {observe: 'response', withCredentials: true})
    //.pipe(
    //  map(res => {
    //    let headers = res.headers
    //    const customHeader = headers.get('Authorization')
    //    console.log(customHeader)
    //  }, catchError(this.handleError))
    //)
    const headers = new HttpHeaders({
      'Access-Control-Expose-Headers':'Authorization'
    })
    return this.http.get<any>(
      `http://localhost:3001`, {headers, observe: 'response', withCredentials: true}
    ).subscribe((res: any) => {
      const customHeader = res.headers.get('Authorization')
      return res
    }, error => {
      return error.message
    })
  }

  handleError(error: any){
    return error.message
  }

  async ngOnInit(){
    // testing
    //await this.testHttpReq()
    //
    await this.authService.autoLogin();
    setTimeout(() => {
      this.curr_page = this.router.url
    },500)
    this.route_sub = this.router.events.subscribe((res) => {
      if (res instanceof NavigationStart){
        this.curr_page = res.url.split('?')[0]
      }
    })
    this.authService.loggedIn.subscribe((loggedIn: boolean) => {
      if (loggedIn){
        this.appPages = [
          {title: 'Variants', url: '/home', icon: 'home'},
          {title: 'Contact', url: '/contact', icon: 'mail'},
          {title: 'Logout', url: '/logout', icon: 'log-out'},
          {title: 'Delete Account', url: '/delete', icon: 'trash', color: 'var(--ion-color-danger'}
        ]
      } else {
        this.appPages = [
          {title: 'Auth', url: '/auth', icon: 'log-in'},
          {title: 'Contact', url: '/contact', icon: 'mail'}
        ]
      }
    })
  }

  async navigate(path: string){
    if (path === '/logout'){
      return await this.authService.logout();
    }
    if (path === '/delete'){
      return await this.authService.deleteAccount();
    }
    return this.helperService.navigate(path)
  }
}
