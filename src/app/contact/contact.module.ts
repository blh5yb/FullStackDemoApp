import { NgModule } from '@angular/core';

import { ContactPageRoutingModule } from './contact-routing.module';

import { ContactPage } from './contact.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ContactPageRoutingModule
  ],
  declarations: [ContactPage]
})
export class ContactPageModule {}
