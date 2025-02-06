import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelperService } from './services/helper.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SwUpdate } from '@angular/service-worker';
import { WidgetService } from './services/widget.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {

  appPages: any[] = []
  curr_page!: string
  route_sub!: Subscription
  isAuthenticated = false;

  authenicatedPages = [
    {title: 'Variants', url: '/home', icon: 'home'},
    {title: 'Contact', url: '/contact', icon: 'mail'},
    {title: 'Logout', url: '/logout', icon: 'log-out'},
    {title: 'Delete Account', url: '/delete', icon: 'trash', color: 'var(--ion-color-danger'}
  ]

  publicPages = [
    {title: 'Auth', url: '/auth', icon: 'log-in'},
    {title: 'Contact', url: '/contact', icon: 'mail'}
  ]

  constructor(
    private helperService: HelperService,
    private router: Router,
    private authService: AuthService,
    private swUpdate: SwUpdate,
    private widgetService: WidgetService
  ) {
    this.initializeApp()
  }

  ngOnDestroy(): void {
      
  }

  handleError(error: any){
    return error.message
  }

  async initializeApp(){
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(async(event) => {
        if (event.type === "VERSION_READY") {
          const header = "New version available. Load New Version?"
          let action: any = await this.widgetService.confirmAction(header, 'Update', 'refresh', null);
          if (action === 'Complete'){
            window.location.reload();
          } else {
            return
          }
        }
      });
    }
    setTimeout(() => {
      this.curr_page = this.router.url
    },500)
    this.route_sub = this.router.events.subscribe((res) => {
      if (res instanceof NavigationStart){
        this.curr_page = res.url.split('?')[0]
      }
    })
    this.isAuthenticated = await this.authService.autoLogin();
    this.appPages = this.isAuthenticated ? this.authenicatedPages : this.publicPages;
    this.authService.loggedIn.subscribe((loggedIn: boolean) => {
      if (loggedIn){
        this.appPages = this.authenicatedPages
      } else {
        this.appPages = this.publicPages
      }
      this.isAuthenticated = loggedIn
    })
  }

  ngOnInit(){
    // testing
    //await this.testHttpReq()
    //
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
