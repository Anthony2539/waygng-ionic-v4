import { Component, OnInit } from '@angular/core';
import { Tarif } from '../../models/tarif';
import { GinkoService } from '../../services/ginko.service';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.page.html',
  styleUrls: ['./tarif.page.scss'],
})
export class TarifPage implements OnInit {

  loading: boolean = false;
  listeTarif: Tarif[] = [];

  constructor(private ginkoService:GinkoService,
              private ga: GoogleAnalytics,   
              public myToast: MyToastComponent) { }

  ngOnInit() {
      this.ga.trackView('Tarif page');
      this.loading = true;
      this.ginkoService.fetchTitreTransport().subscribe((tarifs) =>{
        this.listeTarif = tarifs;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.myToast.createToast("ERROR_IMPOSSIBLE_REFRESH", 'top');
      });
    }

}
