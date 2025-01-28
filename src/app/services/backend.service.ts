import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WidgetService } from './widget.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient,
    private widgetService: WidgetService
  ) { }

  async sendEmail(data: any): Promise<any>{
    // public endpoint
    await this.widgetService.presentLoading();
    return await new Promise<void>((resolve, reject) => {
    this.http.post<any>(`${environment.email_api}/email/sendEmail`, data)
      .toPromise()
      .then(async(res: any) => {
        await this.widgetService.dismissLoading();
        resolve(res)
        return res
      }).catch(async(error: any) => {
        await this.widgetService.dismissLoading();
        reject(error)
        return null
      })
    })
  }
}
