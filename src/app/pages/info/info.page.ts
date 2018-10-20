import { Component, OnInit } from '@angular/core';
import { GinkoService } from '../../services/ginko.service';
import { Observable } from 'rxjs';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { InfosTrafic } from '../../models/infos-trafic';
import { PopoverController } from '@ionic/angular';
import { GinkoInfoComponent } from '../../components/ginko-info/ginko-info.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { InfoTrafic } from '../../models/info-trafic';

export interface ComplementInfo{
  station:string,
  info:string,
}

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  isInfosAnticipees: boolean = false;
  loading: boolean = false;
  infosTrafic: InfosTrafic;

  constructor(private ginkoService:GinkoService,
              private ga: GoogleAnalytics, 
              public myToast: MyToastComponent, 
              private iab: InAppBrowser,
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
    this.ginkoService.fetchInfosTrafic().subscribe((infosTrafics:InfosTrafic) => {
      if(infosTrafics && infosTrafics.infosAnticipees){
        infosTrafics.infosAnticipees.forEach((infosAnticipees:InfoTrafic) =>{
          if(infosAnticipees.complement){
            let complementInfos:ComplementInfo[] = [];
            let parser = new DOMParser();
            let parsedHtml = parser.parseFromString(infosAnticipees.complement, 'text/html');
            let trElements=parsedHtml.getElementsByTagName("tr");
            if(trElements && trElements.length > 0){
              for (let i = 0; i < trElements.length; i++) {
                let thElements = trElements[i].getElementsByTagName("th");
                if(thElements && thElements.length == 2){
                  complementInfos.push({station:thElements[0].innerHTML, info:thElements[1].innerHTML});
                }else{
                  let tdElements = trElements[i].getElementsByTagName("td");
                  if(tdElements && tdElements.length == 2){
                    complementInfos.push({station:tdElements[0].innerHTML, info:tdElements[1].innerHTML});
                  }
                }
              }
            }
            infosAnticipees.complementInfos = complementInfos;
          }
        });
      }
      this.infosTrafic = infosTrafics;
      this.loading = false;
      if(refresher){
        refresher.target.complete();
      }
    },
    (err) => {
      if(refresher){
        refresher.target.complete();
      }
      this.loading = false;
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

  openLink(url:string){
    this.iab.create(url);
  }
  

}
