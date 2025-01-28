import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { variantTypes } from 'src/app/constants';
import { Variant } from 'src/app/models/variants.model';
import { VariantsService } from 'src/app/services/variants.service';
import { EditVariantComponent } from '../edit-variant/edit-variant.component';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { WidgetService } from 'src/app/services/widget.service';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { ChromosomeModalComponent } from '../chromosome-modal/chromosome-modal.component';
import { HelperService } from 'src/app/services/helper.service';
import { QualModalComponent } from '../qual-modal/qual-modal.component';
import { VartypeModalComponent } from '../vartype-modal/vartype-modal.component';

@Component({
  selector: 'app-variants-list',
  templateUrl: './variants-list.component.html',
  styleUrls: ['./variants-list.component.scss'],
})
export class VariantsListComponent  implements OnInit, OnDestroy{
  @Input() user: User;
  @Input() chromosomes: any[] = []
  filterKeys = ['Chromosomes', 'VariantTypes', 'Quality']
  filtersChanged = new Subject<any>();
  filters: any = {
    chromosomes: [],
    variant_type: [],
    quality: {min: 0.0, max: 100.0}
  }

  isLoading = false;
  variants: Variant[]
  filteredVariants: Variant[] = []
  filtersSub: Subscription;
  max_variants = environment.max_variants
  isMobile: boolean = false;
  

  constructor(
    private variantService: VariantsService,
    private modalCtrl: ModalController,
    private widgetService: WidgetService,
    private dataStorage: DataStorageService,
    private helperService: HelperService
  ) { }

  ngOnDestroy(): void {
      if (this.filtersSub){this.filtersSub.unsubscribe()}
  }

  ngOnInit() {
    //this.chromosomes = this.helperService.deepCopy(chromosomes)
    this.helperService.isMobile.subscribe((mobile: boolean) => {
      this.isMobile = mobile
    })
    this.variants = this.variantService.getVariants()
    //this.filterVariants(this.filters)
    this.variantService.variantsChanged.subscribe((variants: any[]) => {
      this.variants = variants
      const filters = this.variantService.getFilters()
      this.setData(filters)
      //this.filterVariants(this.filters)
    })
    if (!this.filteredVariants.length){
      const filters = this.variantService.getFilters()
      this.setData(filters)
    }
    
    this.filtersSub = this.variantService.filtersChanged.subscribe((filters: any) => {
      this.setData(filters)
    })
  }

  async setData(filters){
    if (this.variants.length){
      await this.widgetService.presentLoading()
      this.filters = this.helperService.deepCopy(filters)
      await this.filterVariants(filters)
    }
  }

  async filterVariants(filters){

    let chromosomes = []
    for (let chr of filters.chromosomes){
      if (chr.selected){
        chromosomes.push(chr.title)
      }
    }
    let vtypes = []
    for (let v of filters.variant_type){
      if (v.selected){
        vtypes.push(v.title)
      }
    }
    let variants: any[] = this.variants.filter((variant: any) => {
      return variant.quality >= filters.quality.min && variant.quality <= filters.quality.max
    }).filter((variant: Variant) => {
      return chromosomes.includes(variant.chr) && vtypes.includes(variant.variant_type)
    })
    this.filteredVariants = variants
    await this.widgetService.dismissLoading();
  }



  async createVariant(){
    const modal = await this.modalCtrl.create({
      component: EditVariantComponent,
      componentProps: {
        mode: 'create',
        chromosomes: this.chromosomes,
        variant_types: variantTypes,
        user: this.user
      },
      //cssClass: 'backTransparent',
      cssClass: 'modal-fullscreen',
      backdropDismiss: true,
      canDismiss: true,
      mode: 'ios'
    });

    modal.onDidDismiss().then(async (res: any) => {
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

  async chooseFilters(filterKey){
    filterKey = filterKey.toLocaleLowerCase()
    if (filterKey === 'chromosomes'){
      await this.selectChromosomes()
    } else if (filterKey === 'quality'){
      await this.selectQual();
    } else {
      await this.selectVartypes();
    }
  }

  async selectChromosomes(){
    const modal = await this.modalCtrl.create({
      component: ChromosomeModalComponent,
      componentProps: {
        chromosomes: this.chromosomes,
        selectedChromosomes: this.filters.chromosomes.slice()
      },
      backdropDismiss: true,
      backdropBreakpoint: 0,
      initialBreakpoint: 0.95,
      breakpoints: [0.95],
      canDismiss: true,
      mode: 'md'
    });

    modal.onDidDismiss().then(async (res: any) => {
      if (res && res.data){
        // add to db
        await this.widgetService.presentLoading();
        this.variantService.updateFilters('chromosomes', res.data.chromosomes)
        return await this.widgetService.dismissLoading();
      }
    })

    await modal.present();
  }

  async selectVartypes(){
    const modal = await this.modalCtrl.create({
      component: VartypeModalComponent,
      componentProps: {
        variantTypes: this.filters.variant_type,
      },
      backdropDismiss: true,
      backdropBreakpoint: 0,
      initialBreakpoint: 0.95,
      breakpoints: [0.95],
      canDismiss: true,
      mode: 'md'
    });

    modal.onDidDismiss().then(async (res: any) => {
      if (res && res.data){
        // add to db
        await this.widgetService.presentLoading();
        this.variantService.updateFilters('variant_type', res.data.variant_type)
        return await this.widgetService.dismissLoading();
      }
    })

    await modal.present();
  }

  async selectQual(){
    const modal = await this.modalCtrl.create({
      component: QualModalComponent,
      componentProps: {
        qual: this.filters.quality,
      },
      backdropDismiss: true,
      backdropBreakpoint: 0,
      initialBreakpoint: 0.95,
      breakpoints: [0.95],
      canDismiss: true,
      mode: 'md'
    });

    modal.onDidDismiss().then(async (res: any) => {
      if (res && res.data){
        // add to db
        await this.widgetService.presentLoading();
        this.variantService.updateFilters('quality', res.data.qual)
        return await this.widgetService.dismissLoading();
      }
    })

    await modal.present();
  }
}
