import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Station } from '../station';
import { GinkoService } from '../ginko.service';
import { TempsAttente } from '../temps-attente';
import { MyToastComponent } from '../components/my-toast/my-toast.component';

@Component({
  selector: 'app-station',
  templateUrl: './station.page.html',
  styleUrls: ['./station.page.scss'],
})
export class StationPage implements OnInit {

  station:Station;
  loading:boolean = false;
  listeTemps: TempsAttente[] = [];
  nomExact: string;
  dateLastUpdate: number;

  constructor(private route: ActivatedRoute, private ginkoService: GinkoService, public myToast: MyToastComponent) { }

  ngOnInit() {

    this.station = this.route.snapshot.queryParams as Station;
    this.fetchStationTemps();
  }

  fetchStationTemps(refresher?){
    if(this.station){
      //this.checkIfInFavoris();
      this.listeTemps = [];
      this.loading = true;
      this.ginkoService.fetchTempsLieu(this.station.name).subscribe((stationAttente) => {
        this.nomExact = stationAttente.nomExact;
          let map = new Map;
          for (var i = 0; i < stationAttente.listeTemps.length; i++) {
            let currentStation = stationAttente.listeTemps[i];
            let key = currentStation.idLigne+currentStation.idArret;
            if(map.get(key) == null){
              map.set(key,[currentStation]);
            }else{
              let lstStation = map.get(key);
              lstStation.push(currentStation);
              map.set(key,lstStation);
            }
          }

          map.forEach(lstStation => {
            let lstTemps = [];
            let currentStation = lstStation[0];
            for (var i = 0; i < lstStation.length; i++) {
              lstTemps.push(lstStation[i].temps);
            }
            currentStation.lstTemps = lstTemps;
            this.listeTemps.push(currentStation);

          });
        this.dateLastUpdate = new Date().getTime();

        //this.checkIfTempsAttenteInFavoris();

        if(refresher != null){
          refresher.complete();
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        if(refresher){
          refresher.complete();
        }
        this.myToast.createToast("ERROR_IMPOSSIBLE_REFRESH", 'top');
      }
    );
  }
}

}
