import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  curr_page!: string
  isLoading: boolean = false;
  activate!: string;

  pages: any[] = [
    {url: '/auth/signin', title: 'Log In'},
    {url: '/auth/register', title: 'Register'}
  ]

  constructor(
    private router: Router,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.curr_page = this.router.url
    if (this.router.url === '/auth'){
      this.helperService.navigate('/auth/signin')
      this.curr_page = '/auth/signin'
    }
    this.isLoading = false;
  }

  switchPage(route: string){
    this.helperService.navigate(route)
    this.curr_page = route
  }

  componentAdded(activate: any){
    this.activate = activate;
  }

}
