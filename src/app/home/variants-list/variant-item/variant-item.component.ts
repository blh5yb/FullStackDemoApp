import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { VariantsService } from 'src/app/services/variants.service';
import { WidgetService } from 'src/app/services/widget.service';
import { variantTypes } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { Variant } from 'src/app/models/variants.model';
import { EditVariantComponent } from '../../edit-variant/edit-variant.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-variant-item',
  templateUrl: './variant-item.component.html',
  styleUrls: ['./variant-item.component.scss'],
})
export class VariantItemComponent  implements OnInit {
  @Input() user: User;
  @Input() variant: Variant;
  
  chromosomes: any[] = []

  constructor(
    private modalCtrl: ModalController,
    private widgetService: WidgetService,
    private dataStorage: DataStorageService
  ) { }

  ngOnInit() {}

  async viewVariant(){
    const modal = await this.modalCtrl.create({
      component: EditVariantComponent,
      componentProps: {
        mode: 'edit',
        chromosomes: this.chromosomes,
        variant_types: variantTypes,
        user: this.user,
        varId: this.variant._id ? this.variant._id : null,
        myVariant: this.variant
      },
      //cssClass: 'backTransparent',
      cssClass: 'modal-fullscreen',
      backdropDismiss: true,
      canDismiss: true,
      mode: 'ios',
    });

    modal.onDidDismiss().then(async(res: any) => {
      if (res && res.data){
        // add to db
        await this.widgetService.presentLoading();
        const variantsEndpoint = `${environment.variants_api}/variants`
        await this.dataStorage.fetchCollection(variantsEndpoint, 'variants')
        return await this.widgetService.dismissLoading();
      }
    })
    await modal.present();
  }

}
