import { Injectable } from '@angular/core';
import { Variant } from '../models/variants.model';
import { Subject } from 'rxjs';
import { variantTypes } from '../constants';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {

  variants: Variant[] = [];
  variantsChanged = new Subject<Variant[]>;
  filters: any = {
    chromosomes: [],
    variant_type: [],
    quality: {min: 0.0, max: 100.0}
  }
  chromosomes = []
  filtersChanged = new Subject<any[]>;

  constructor(
    private helperService: HelperService
  ) { }

  setVariants(data: any){
    let variants = []
    for (let variant of data){
      variants.push(variant)
    }
    this.variants = variants.sort((a, b) => b.chr - a.chr)
    this.variantsChanged.next(this.variants)
    return this.variants
  }

  getVariants(){
    return this.variants.slice()
  }

  getFilters(){
    return this.helperService.deepCopy(this.filters)
  }

  setFilters(){
    let filters = this.helperService.deepCopy(this.filters)
    let chromosomes: any = []
    let variant_types: any = []
    for (let variant_type of variantTypes){
      variant_types.push({selected: true, title: variant_type})
    }
    for (let i = 1; i <= 23; i++){
      //chromosomes.push(`chr${i}`)
      chromosomes.push({
        selected: true,
        title: `chr${i}`,
      })
    }
    chromosomes.concat([{
      selected: true,
      title: 'chrX',
    }, {
      selected: true,
      title: 'chrY',
    }])
    filters.chromosomes = this.helperService.deepCopy(chromosomes)
    this.chromosomes = this.helperService.deepCopy(chromosomes)
    filters.variant_type = this.helperService.deepCopy(variant_types)
    if (!this.helperService.objArrCompare(filters, this.filters)){
      this.filters = filters
      this.filtersChanged.next(filters)
    }
    return chromosomes
  }

  updateFilters(field: string, value: any){
    let filters = this.helperService.deepCopy(this.filters)
    if (!this.helperService.objArrCompare(filters[field], value)){
      filters[field] = value
      this.filters = filters
      this.filtersChanged.next(filters)
    }
  }
}
