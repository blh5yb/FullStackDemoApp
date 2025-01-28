import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { WidgetService } from 'src/app/services/widget.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent  implements OnInit {

  isLoading: boolean = false;
  savedLogin: any;
  fieldTextType: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private widgetService: WidgetService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.initLoginForm()
    this.loginForm.valueChanges.subscribe((values: any) => {
      this.fieldTextType = values.showPassword
    })
    this.isLoading = false;
  }

  initLoginForm(){
    this.savedLogin = this.authService.getCredentials()
    this.loginForm = new FormGroup({
      'email': new FormControl(this.savedLogin.email, [Validators.required, Validators.email]),
      'password': new FormControl(this.savedLogin.password, [Validators.required]),
      'savePassword': new FormControl(!!this.savedLogin.password),
      'showPassword': new FormControl('')
    })
  }

  async login(){
    let authInfo = {
      'email': this.loginForm.controls['email'].value,
      'password': this.loginForm.controls['password'].value,
      'savePassword': this.loginForm.controls['savePassword'].value
    };
    return await this.authService.login(authInfo)
  }

  get email() {return this.loginForm.get('email')}
  get password() {return this.loginForm.get('password')}
}
