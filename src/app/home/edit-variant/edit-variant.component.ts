import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { Variant } from 'src/app/models/variants.model';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { HelperService } from 'src/app/services/helper.service';
import { WidgetService } from 'src/app/services/widget.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-variant',
  templateUrl: './edit-variant.component.html',
  styleUrls: ['./edit-variant.component.scss'],
})
export class EditVariantComponent  implements OnInit {

  myVariant: Variant = {
    chr: 'chr1',
    pos: 0,
    ref: 'a',
    alt: 'g',
    variant_type: 'SUBSTITUTION',
    quality: 100.00
  }
  varId: string = null
  mode = 'edit'
  updated = false
  user: User
  chromosomes: any[] = []
  variant_types: any[] = []

  isLoading = false;

  editVariantForm: FormGroup;
  showSpinner = false;

  constructor(
    private modalCtrl: ModalController,
    private helperService: HelperService,
    private dataStorage: DataStorageService,
    private widgetService: WidgetService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.updated = (this.mode === 'create')
    this.initVariantForm()
    this.editVariantForm.valueChanges.subscribe(() => {
      if (!this.updated){
        this.updated = true
      }
    })
    console.log(this.myVariant)
    this.isLoading = false;
  }

  initVariantForm(){
    this.editVariantForm = new FormGroup({
      'chr': new FormControl(this.myVariant.chr, Validators.required),
      'pos': new FormControl(this.myVariant.pos, Validators.required),
      'ref': new FormControl(this.myVariant.ref, Validators.required),
      'alt': new FormControl(this.myVariant.alt, Validators.required),
      'variant_type': new FormControl(this.myVariant.variant_type, Validators.required),
      'quality': new FormControl(this.myVariant.quality, [Validators.required, Validators.max(100), Validators.min(0)]),
    })
  }

  get chr() {return this.editVariantForm.get('chr')}
  get pos() {return this.editVariantForm.get('pos')}
  get ref() {return this.editVariantForm.get('ref')}
  get alt() {return this.editVariantForm.get('alt')}
  get variant_type() {return this.editVariantForm.get('variant_type')}
  get quality() {return this.editVariantForm.get('quality')}

  back(){
    return this.modalCtrl.dismiss()
  }

  async save(){
    this.showSpinner = true;
    const variant = {
      _id: this.varId,
      created_at: this.myVariant.created_at ? this.myVariant.created_at : null,
      updated_at: this.myVariant.updated_at ? this.myVariant.updated_at : null,
      chr: this.editVariantForm.controls.chr.value,
      pos: this.editVariantForm.controls.pos.value,
      ref: this.editVariantForm.controls.ref.value,
      alt: this.editVariantForm.controls.alt.value,
      quality: this.helperService.round(this.editVariantForm.controls.quality.value),
      variant_type: this.editVariantForm.controls.variant_type.value
    }
    //save to backend
    try{
      if (this.mode === 'create'){
        // create endpoint
          const variantsEndpoint = `${environment.variants_api}/variants`
          await this.dataStorage.createDoc(variantsEndpoint, variant, 'variants', this.user.token)
      } else {
        // update
        if (this.varId){
          const variantsEndpoint = `${environment.variants_api}/variants/${this.varId}`
          await this.dataStorage.updateDoc(variantsEndpoint, variant, 'variants', this.user.token)
        } else {
          this.widgetService.presentAlert("Missing variant id")
        }
      }
      this.showSpinner = false
      return this.modalCtrl.dismiss({variant: variant})
    } catch (error){
      this.showSpinner = false
      return this.back()
    }
  }

  async deleteVariant(){
    const action = await this.widgetService.confirmAction(
      "Are you sure you want to delete this variant", "This action cannot be undone"
    )
    if (action && action === 'Complete'){
      await this.widgetService.presentLoading();
      const variantsEndpoint = `${environment.variants_api}/variants/${this.varId}`
      await this.dataStorage.deleteDoc(variantsEndpoint, 'variants', this.user.token)
      await this.widgetService.dismissLoading();
      this.modalCtrl.dismiss({delete: true})
    }
  }

}
