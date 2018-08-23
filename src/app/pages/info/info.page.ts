import { Component, OnInit } from '@angular/core';
import { GinkoService } from '../../services/ginko.service';
import { Observable } from 'rxjs';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { InfosTrafic } from '../../models/infos-trafic';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  infosTrafic: Observable<InfosTrafic>;

  constructor(private ginkoService:GinkoService, public myToast: MyToastComponent) { }

  ngOnInit() {
    this.getInfosTrafic(null);
  }

  getInfosTrafic(refresher){
    this.infosTrafic = this.ginkoService.fetchInfosTrafic();
    this.infosTrafic.subscribe(() => {
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
  

}
