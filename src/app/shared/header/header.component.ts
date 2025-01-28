import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit, OnDestroy {

  is_mobile: boolean = false;
  is_small: boolean = false;
  curr_page!: string;
  route_sub!: Subscription;
  isAuthenticated: boolean = false;

  constructor(
    private helperService: HelperService,
    private router: Router,
    private authService: AuthService
  ) { 
  }
  appPages: any[] = [
    {title: 'CONTACT', url: '/contact', icon: 'mail'}
  ]
  desctuctivePages: any[] = []

  ngOnDestroy(): void {
    if (this.route_sub){
      this.route_sub.unsubscribe()
    }
  }

  ngOnInit() {
    this.curr_page = this.router.url.split('?')[0]
    this.authService.loggedIn.subscribe((loggedIn: boolean) => {
      if (loggedIn){
        this.appPages = [
          {title: 'VARIANTS', url: '/home', icon: 'home'},
          {title: 'CONTACT', url: '/contact', icon: 'mail'},
        ]
        this.desctuctivePages = [
          {title: 'LOGOUT', url: '/logout', icon: 'log-out'},
          {title: 'DELETE ACCOUNT', url: '/delete', icon: 'trash-out', color: 'var(--ion-color-danger'}
        ]
      } else {
        this.appPages = [
          {title: 'AUTH', url: '/auth', icon: 'log-in'},
          {title: 'CONTACT', url: '/contact', icon: 'mail'}
        ]
        this.desctuctivePages = []
      }
      this.isAuthenticated = loggedIn
    })
    this.helperService.isMobile.subscribe((mobile: boolean) => {
      this.is_mobile = mobile
    })
    this.helperService.isSmallScreen.subscribe((small: boolean) => {
      this.is_small = small
    })
    this.route_sub = this.router.events.subscribe((res) => {
      if (res instanceof NavigationStart){
        this.curr_page = res.url.split('?')[0]
      }
    })

    //subscribe to auth service and update the header
  }

  async goToLink(page: string){
    if (page === '/logout'){
      return await this.authService.logout();
    }
    if (page === '/delete'){
      return await this.authService.deleteAccount();
    }
    return this.helperService.navigate(page)
  }

  getHeader(){
    let current = this.appPages.find((page: any) => {
      return this.curr_page.includes(page.url)
    })
    return current.title
  }

}
