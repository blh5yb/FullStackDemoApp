import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { VariantsListComponent } from './variants-list/variants-list.component';
import { VariantItemComponent } from './variants-list/variant-item/variant-item.component';
import { EditVariantComponent } from './edit-variant/edit-variant.component';
import { ChromosomeModalComponent } from './chromosome-modal/chromosome-modal.component';
import { QualModalComponent } from './qual-modal/qual-modal.component';
import { VartypeModalComponent } from './vartype-modal/vartype-modal.component';


@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage, VariantsListComponent, VariantItemComponent,
    ChromosomeModalComponent, VartypeModalComponent, QualModalComponent,
    EditVariantComponent
  ]
})
export class HomePageModule {}
