import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Station } from '../../models/station';
import { GinkoService } from '../../services/ginko.service';
import { TempsAttente } from '../../models/temps-attente';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { TempsAttenteFav } from '../../models/temps-attente-fav';
import { FavorisService } from '../../services/favoris.service';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

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
              private router: Router,
              private ga: GoogleAnalytics,
              private ginkoService: GinkoService, 
              private favorisService: FavorisService,
              private location: Location,
              public myToast: MyToastComponent) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.station = params["params"];
      this.fetchStationTemps();
      this.ga.trackView('Station page: '+this.station.name);
    });
  }

  goBack(){
    this.location.back();
  }

  doRefresh(refresher) {
    this.fetchStationTemps(refresher);
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

        this.checkIfTempsAttenteInFavoris();

        if(refresher != null){
          refresher.target.complete();
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        if(refresher){
          refresher.target.complete();
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

checkIfTempsAttenteInFavoris(){
  this.favorisService.getFavorisTempsAttenteList(this.station.id).valueChanges().subscribe((tempsAttenteFav:TempsAttenteFav[]) => {
    this.listeTemps.forEach((temps:TempsAttente) =>{
      tempsAttenteFav.forEach((tempsFav:TempsAttenteFav) => {
        if(temps.idArret == tempsFav.idArret && temps.sensAller == tempsFav.sensAller && temps.idLigne == tempsFav.idLigne){
          temps.isInfavoris = true;
        }
      });
    });

  });
}


eventFavoris(tempsAttente?:TempsAttente){
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

goSchedule(tempsAttente:TempsAttente){
  let request = {idLigne:tempsAttente.idLigne,
                idArret:tempsAttente.idArret, 
                sensAller:"1",
                numLignePublic:tempsAttente.numLignePublic,
                couleurTexte:tempsAttente.couleurTexte,
                couleurFond:tempsAttente.couleurFond,
                destination:tempsAttente.destination,
                precisionDestination:tempsAttente.precisionDestination,
                stationName:this.station.name};
  if(tempsAttente.sensAller){
    request.sensAller = "0";
  }
  this.router.navigate(['schedule'], {queryParams: request});
}

}
