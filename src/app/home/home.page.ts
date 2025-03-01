import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataStorageService } from '../services/data-storage.service';
import { environment } from 'src/environments/environment';
import { WidgetService } from '../services/widget.service';
import { User } from '../models/user.model';
import { Variant } from '../models/variants.model';
import { VariantsService } from '../services/variants.service';
import { IonContent } from '@ionic/angular';
import { CacheService } from '../services/cache.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;


  chromosomes: any[] = []
  user: User
  variants: Variant[] = []
  isLoading = false;

  constructor(
    private authService: AuthService,
    private widgetService: WidgetService,
    private dataStorage: DataStorageService,
    private variantService: VariantsService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user.value
    this.isLoading = true;
    // this.variants = this.variantService.getVariants();
    this.chromosomes = this.variantService.setFilters();
    this.setData();
    //if (!this.variants.length){
    //  this.setData();
    //} else {
    //  this.isLoading = false;
    //}
  }

  async setData(){
    await this.widgetService.presentLoading()
    const variantsEndpoint = `${environment.variants_api}/variants`
    await this.dataStorage.fetchVariants(variantsEndpoint, 'variants')
    this.variants = this.variantService.getVariants();
    this.isLoading = false;
    await this.widgetService.dismissLoading();
  }

  test(){
    this.authService.refreshToken()
  }

  scrollToTop(){
    this.content.scrollToTop(250);
  }

}
