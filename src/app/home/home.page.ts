import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataStorageService } from '../services/data-storage.service';
import { environment } from 'src/environments/environment';
import { WidgetService } from '../services/widget.service';
import { User } from '../models/user.model';
import { Variant } from '../models/variants.model';
import { VariantsService } from '../services/variants.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

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
    this.variants = this.variantService.getVariants();
    if (!this.variants.length){
      this.setData();
    } else {
      this.isLoading = false;
    }
  }

  async setData(){
    await this.widgetService.presentLoading();
    const variantsEndpoint = `${environment.variants_api}/variants`
    await this.dataStorage.fetchCollection(variantsEndpoint, 'variants')
    this.variants = this.variantService.getVariants();
    this.chromosomes = this.variantService.setFilters();
    this.isLoading = false;
    await this.widgetService.dismissLoading();
  }

  test(){
    this.authService.refreshToken()
  }

}
