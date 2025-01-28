import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  implements OnInit {

  isLoading: boolean = false;
  fieldTextType: boolean = false;
  error: (string | null) = ''
  savedLogin: any;
  passMin = 5;
  stringMax = 255;

  signUpForm!: FormGroup


  constructor(
    private authService: AuthService,
    private helperService: HelperService,
    private customValidatorService: CustomValidatorsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.initSignupForm()
    this.signUpForm.valueChanges.subscribe((values: any) => {
      this.fieldTextType = values.showPassword
    })
    this.isLoading = false;
  }

  initSignupForm(){
    this.signUpForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.maxLength(this.stringMax)]
        ),
      'email': new FormControl('', [Validators.required, Validators.email],
        this.customValidatorService.asyncEmailControl()),
      'password': new FormControl('', [Validators.required, Validators.minLength(this.passMin), Validators.maxLength(this.stringMax)]),
      'savePassword': new FormControl(false),
      'showPassword': new FormControl(false)
    })
  }

  async signUp(){
    let authInfo = {
      'name': this.signUpForm.controls['name'].value,
      'email': this.signUpForm.controls['email'].value,
      'password': this.signUpForm.controls['password'].value,
      'savePassword': this.signUpForm.controls['savePassword'].value
    };
    return await this.authService.register(authInfo)
  }

  get email() {return this.signUpForm.get('email')}
  get name() {return this.signUpForm.get('name')}
  get password() {return this.signUpForm.get('password')}

}
