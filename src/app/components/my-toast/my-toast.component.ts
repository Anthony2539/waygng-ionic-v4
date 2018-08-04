import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'my-toast',
  templateUrl: './my-toast.component.html',
  styleUrls: ['./my-toast.component.scss']
})
export class MyToastComponent implements OnInit {

  constructor(public toastCtrl: ToastController, private translate: TranslateService) { }

  ngOnInit() {
  }

  async  createToast(message:string, position:string, value?:string){
    
    new Promise((resolve, reject) => { this.translate.get(message).subscribe((messageI18n) => {
      let message = messageI18n;
      if(value){
        message = value + " "+messageI18n;
      }
      resolve(this.presentToast(message,position));
    });
      
    });
  }

  private async presentToast(message:string, position:string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position 
    });
    toast.present();
  }

}
