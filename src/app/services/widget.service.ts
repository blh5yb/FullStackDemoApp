import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  loading: any | null = null;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private actionSheetController: ActionSheetController
  ) { }

    async presentToast(message: string){
      const toast = await this.toastController.create({
        message,
        duration: 5000,
        position: this.platform.is('desktop') ? 'top': 'bottom'
      })
      toast.present();
    }

    async presentAlert(header: any = 'An Error Occurred', subHeader: any = null, message: any = null, buttons: any = ['OK'], inputs: any = []) {
      const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: buttons,
        inputs: inputs,
        mode: 'ios'
      });
      await alert.present();
  
      await alert.onDidDismiss().then((res: any) => {
        return res
      })
    }

    async presentLoading(){
      if (!this.loading){
        this.loading = await this.loadingCtrl.create();
        return await this.loading.present();
      }
    }
  
    async dismissLoading(){
      if (!!this.loading){
        await this.loading.dismiss();
        this.loading = null
      }
    }

    async confirmAction(header: string, my_text: string = 'Delete', my_icon: string = 'trash', my_role: string = 'destructive'){
      if (!Object.values(this.platform.platforms()).includes('desktop')){
        let action: string = ''
        const actionSheet = await this.actionSheetController.create({
          header: header,
          buttons: [
            {
              text: my_text,
              role: my_role,
              icon: my_icon,
              handler: () => {
                action = 'Complete'
              },
            },
            {
              text: 'Cancel',
              icon: 'close',
              role: 'cancel',
              handler: () => {
                action = 'Cancel'
              },
            },
          ]
        });
        await actionSheet.present();
    
        const { role } = await actionSheet.onDidDismiss();
        return action
      } else {
        if(confirm(header)){
            return 'Complete';
        } else {
          return 'Cancel'
        }
      }
    }
}
