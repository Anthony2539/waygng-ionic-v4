import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Station } from '../../models/station';
import { GinkoService } from '../../services/ginko.service';
import { TempsAttente } from '../../models/temps-attente';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Favoris } from '../../models/favoris';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import * as _ from 'lodash';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Line } from '../../models/line';
import { Variante } from '../../models/variante';

@Component({ 
  selector: 'app-station',
  templateUrl: './station.page.html',
  styleUrls: ['./station.page.scss'],
})
export class StationPage implements OnInit {

  classTimeContainer:string = "timeContainer";
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
              private userService: UserService,
              private location: Location,
              private nativeStorage: NativeStorage,
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
      this.classTimeContainer = "timeContainer";
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

          if(this.listeTemps.length == 0){
            this.classTimeContainer = "timeContainerEmpty";
            this.nativeStorage.getItem('mapStationLines').then(
              data => {
                if(data){
                  let stationLines:any = _.find(data,{nameStation:this.station.name});
                  if(stationLines && stationLines.lines.length > 0){
                    stationLines.lines.forEach((line:Line) => {
                      if(line.variantes && line.variantes.length > 0){
                        line.variantes.forEach((variante:Variante) => {
                          const tempsAttente:TempsAttente = {
                            idArret: this.station.id,
                            idLigne:  line.id,
                            numLignePublic: line.numLignePublic,
                            couleurFond: line.couleurFond,
                            couleurTexte: line.couleurTexte,
                            sensAller: variante.sensAller,
                            destination: variante.destination,
                            precisionDestination: variante.precisionDestination,
                            temps: "",
                            fiable: true,
                            numVehicule: "",
                            latitude: this.station.latitude,
                            longitude: this.station.longitude,
                            lstTemps: ["Aucun bus dans l'heure","Consulter la fiche horaire"],
                          }
                          this.listeTemps.push(tempsAttente);
                        });
     
                      }
                    });
                  }
                }
              }
            );
          }

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
  this.userService.getUser().pipe(take(1)).subscribe((user:User) => {
    if(user.favs && user.favs.length > 0){
      const found = _.find(user.favs, {station:this.station});
      if(found){
        this.isInfavoris = true;
      }else{
        this.isInfavoris = false;
      }
    }
  });
}

checkIfTempsAttenteInFavoris(){
  this.userService.getUser().pipe(take(1)).subscribe((user:User) => {
    if(user.favs && user.favs.length > 0){
      this.listeTemps.forEach((temps:TempsAttente) =>{
        user.favs.forEach((fav:Favoris) => {
          if(temps.idArret == fav.idArret && temps.sensAller == fav.sensAller && temps.idLigne == fav.idLigne){
            temps.isInfavoris = true;
          }
        });
      });
    }
  });
}


eventFavoris(tempsAttente?:TempsAttente){
  let fav: Favoris = {
    isStation: false,
    station:this.station
  }

  if(tempsAttente){
    fav.idArret= tempsAttente.idArret;
    fav.idLigne= tempsAttente.idLigne;
    fav.sensAller= tempsAttente.sensAller;
    fav.destination= tempsAttente.destination;
    fav.numLignePublic= tempsAttente.numLignePublic;
    fav.couleurFond= tempsAttente.couleurFond;
    fav.couleurTexte= tempsAttente.couleurTexte;

    if(tempsAttente.isInfavoris){
      tempsAttente.isInfavoris = false;
      this.userService.removeFavoris(fav);
      this.myToast.createToast('REMOVED_FAVORITES','bottom',fav.destination);
    }else{
      tempsAttente.isInfavoris = true;
      this.userService.addFavoris(fav);
      this.myToast.createToast('ADDED_FAVORITES','bottom',fav.destination);
    }

  }else{
    fav.isStation = true;
    if(this.isInfavoris){
      this.isInfavoris = false;
      this.userService.removeFavoris(fav);
      this.myToast.createToast('REMOVED_FAVORITES','bottom',this.nomExact);
    }else{
      this.isInfavoris = true;
      this.userService.addFavoris(fav);
      this.myToast.createToast('ADDED_FAVORITES','bottom',this.nomExact);
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
