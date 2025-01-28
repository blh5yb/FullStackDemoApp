import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VariantsService } from './variants.service';
import { WidgetService } from './widget.service';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private helperService: HelperService,
    private http: HttpClient,
    private variantService: VariantsService,
    private widgetService: WidgetService
  ) { }

  async fetchCollection(endpoint, cltn){
    return this.http.get<any>(endpoint).pipe(
      tap(res => {
        return this.variantService.setVariants(res.data)
      }),
      catchError(async (error) => {
        this.widgetService.presentAlert(`Error querying data in the ${cltn} database`)
        return error.message
      })
    ).subscribe()
  }

  async createDoc(endpoint, data, cltn, authToken = null){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    })
    return this.http.post(endpoint, data, {headers}
    ).subscribe((res: any) => {
      this.widgetService.presentToast(`Successfully created doc in ${cltn} db`)
      return //this.variantService.setVariants(res.data)
    }, error => {
      this.widgetService.presentAlert(`Error saving data to the ${cltn} database`)
      return error.message
    })
  }

  async updateDoc(endpoint, data, cltn, authToken = null){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    })
    return this.http.put(endpoint, data, {headers}
      ).subscribe((res: any) => {
      this.widgetService.presentToast(`Successfully updated doc in ${cltn} db`)
      return //this.variantService.setVariants(res.data)
    }, error => {
      this.widgetService.presentAlert(`Error updating data for the ${cltn} database`)
      return error.message
    })
  }

  async deleteDoc(endpoint, cltn, authToken = null){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    })
    return this.http.delete(endpoint, {headers}
    ).subscribe((res: any) => {
      this.widgetService.presentToast(`Successfully deleted doc in ${cltn} db`)
      return //this.variantService.setVariants(res.data)
    }, error => {
      this.widgetService.presentAlert(`Error deleting variant from to the ${cltn} database`)
      return error.message
    })
  }
}
