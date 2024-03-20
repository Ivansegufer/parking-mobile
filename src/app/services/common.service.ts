import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastPositionType = 'top' | 'bottom' | 'middle';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public constructor(
    private toastCtrl: ToastController
  ) { }

  public async showToast(
    message: string, 
    duration: number = 5000, 
    position: ToastPositionType = 'bottom'
    ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position
    });
    await toast.present();
  }
}