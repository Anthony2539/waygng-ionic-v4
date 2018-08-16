import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Station } from '../../models/station';
import { GinkoService } from '../../services/ginko.service';
import { TempsAttente } from '../../models/temps-attente';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { TempsAttenteFav } from '../../models/temps-attente-fav';
import { FavorisService } from '../../services/favoris.service';
import { take } from 'rxjs/operators';

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
  isInfavoris:boolean = false;

  constructor(private route: ActivatedRoute, 
              private ginkoService: GinkoService, 
              private favorisService: FavorisService,
              public myToast: MyToastComponent) { }

  ngOnInit() {

    this.station = this.route.snapshot.queryParams as Station;
    this.fetchStationTemps();
  }

  fetchStationTemps(refresher?){
    if(this.station){
      this.checkIfInFavoris();
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
 

checkIfInFavoris(){
  this.favorisService.getFavoris(this.station.name).valueChanges().pipe(take(1)).subscribe(stations => {
    if(stations && stations.length > 0){
      this.isInfavoris = true;
    }else{
      this.isInfavoris = false;
    }
  });
}


eventFavoris(tempsAttente:TempsAttente){
  if(tempsAttente){
    let tempsAttenteFav: TempsAttenteFav = {
      idArret: tempsAttente.idArret,
      idLigne: tempsAttente.idLigne,
      sensAller: tempsAttente.sensAller,
      destination: tempsAttente.destination,
      numLignePublic: tempsAttente.numLignePublic,
      couleurFond: tempsAttente.couleurFond,
      couleurTexte: tempsAttente.couleurTexte,
      station:{
        id:this.station.id,
        name:this.station.name,
        latitude:this.station.latitude,
        longitude:this.station.longitude
      }

    }

    if(tempsAttente.isInfavoris){
      tempsAttente.isInfavoris = false;
      this.favorisService.removeFavorisTempsAttente(tempsAttenteFav);
      this.myToast.createToast('REMOVED_FAVORITES','bottom',tempsAttenteFav.destination);
    }else{
      tempsAttente.isInfavoris = true;
      this.favorisService.addFavorisTempsAttente(tempsAttenteFav);
      this.myToast.createToast('ADDED_FAVORITES','bottom',tempsAttenteFav.destination);
    }

  }else{
    if(this.isInfavoris){
      this.isInfavoris = false;
      this.favorisService.removeFavoris(this.nomExact);
      this.myToast.createToast('REMOVED_FAVORITES','bottom',this.nomExact);
    }else{
      this.isInfavoris = true;
      this.favorisService.addFavoris(this.station).then(() => {
        this.myToast.createToast('ADDED_FAVORITES','bottom',this.nomExact);
      })
    }
  }

}

}
