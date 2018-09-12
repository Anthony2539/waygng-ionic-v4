import { Component, OnInit } from '@angular/core';
import { GinkoService } from '../../services/ginko.service';
import { Observable } from 'rxjs';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { InfosTrafic } from '../../models/infos-trafic';
import { PopoverController } from '@ionic/angular';
import { GinkoInfoComponent } from '../../components/ginko-info/ginko-info.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  isInfosAnticipees: boolean = false;
  loading: boolean = false;
  infosTrafic: Observable<InfosTrafic>;

  constructor(private ginkoService:GinkoService,
              private ga: GoogleAnalytics, 
              public myToast: MyToastComponent, 
              public popoverController: PopoverController) { }

  ngOnInit() {
    this.ga.trackView('Info page');
    this.getInfosTrafic();
  }

  segmentChanged(ev: any) {
    if(ev.detail.value == "infosAnticipees"){
      this.isInfosAnticipees = true;
    }else{
      this.isInfosAnticipees = false;
    }
  }

  getInfosTrafic(refresher?){
    if(!refresher){
      this.loading = true;
    }
    this.infosTrafic = this.ginkoService.fetchInfosTrafic();
    this.infosTrafic.subscribe(() => {
      this.loading = false;
      if(refresher){
        refresher.target.complete();
      }
    },
    (err) => {
      if(refresher){
        refresher.target.complete();
      }
      this.myToast.createToast("ERROR_IMPOSSIBLE_REFRESH", 'top');
    });
  }

  doRefresh(refresher){
    this.getInfosTrafic(refresher);
  }


  async infoGinkoClick() {
    const popoverController = document.querySelector('ion-popover-controller');
    await popoverController.componentOnReady();
    const popoverElement = await popoverController.create({component: 'ginko-info'});
    return await popoverElement.present();
  }

  async presentPopover(ev?: any) {
    const popover = await this.popoverController.create({
      component: GinkoInfoComponent,
      event: event,
      translucent: false
    });
    return await popover.present();
  }
  

}
