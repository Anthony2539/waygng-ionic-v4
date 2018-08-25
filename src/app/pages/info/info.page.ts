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

  loading: boolean = false;
  infosTrafic: Observable<InfosTrafic>;

  constructor(private ginkoService:GinkoService, public myToast: MyToastComponent) { }

  ngOnInit() {
    this.getInfosTrafic();
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
  

}
