import { NgModule } from '@angular/core';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  imports: [
    SharedModule,
    AuthPageRoutingModule
  ],
  declarations: [AuthPage, RegisterComponent, SigninComponent]
})
export class AuthPageModule {}
