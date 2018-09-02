import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavorisService } from '../../services/favoris.service';
import { Station } from '../../models/station';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { GinkoService } from '../../services/ginko.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { SearchListeTemps } from '../../models/search-liste-temps';
import { TempsAttenteFav } from '../../models/temps-attente-fav';
import { StationAttente } from '../../models/station-attente';
import { TempsAttente } from '../../models/temps-attente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  loadFavoris: boolean = false;
  favoris: any[] = [];
  loadStationProche: boolean = false;
  stationProches: Station[] = [];
  latitude: number;
  longitude: number;
  tempsAttenteFavs: TempsAttenteFav[] = [];
  dateLastUpdate: number;
  isErrorLocation:boolean = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    public myToast: MyToastComponent,
    public geolocation: Geolocation,
    public ginkoService: GinkoService,
    public favorisService: FavorisService) {


}

  ngOnInit() {
    this.fetchStationProches();
    this.getFavoris();
  }

  doRefresh(refresher){
    this.fetchStationProches(refresher);
    this.getFavorisTempsAttente(refresher);
  }

  getFavoris(){
    this.favorisService.getFavorisList().valueChanges().subscribe((favoris) => {
      this.favoris = favoris;
    }); 
    this.getFavorisTempsAttente();
  }

  getFavorisTempsAttente(refresher?){
    this.loadFavoris = true;
    this.favorisService.getFavorisTempsAttenteList().valueChanges().subscribe((tempsAttenteFavs:TempsAttenteFav[]) => {
      let searchListeTemps:SearchListeTemps = {listeNoms:[], listeIdLignes:[], listeSensAller:[], preserverOrdre:true,nb:1};
      tempsAttenteFavs.forEach(fav => {
        searchListeTemps.listeNoms.push(fav.station.name);
        searchListeTemps.listeIdLignes.push(fav.idLigne);
        searchListeTemps.listeSensAller.push(fav.sensAller);
      });

      this.ginkoService.fetchListeTemps(searchListeTemps).subscribe((stationAttentes:StationAttente[]) => {
        tempsAttenteFavs.forEach((fav:TempsAttenteFav) => {
          stationAttentes.forEach((stationAttente:StationAttente) => {
            if(stationAttente.nomExact == fav.station.name && stationAttente.listeTemps && stationAttente.listeTemps.length > 0){
              stationAttente.listeTemps.forEach((tempsAttente:TempsAttente) =>{
                if(fav.idArret == tempsAttente.idArret && fav.idLigne == tempsAttente.idLigne && fav.sensAller == tempsAttente.sensAller){
                  fav.temps = tempsAttente.temps;
                }
              });
            }
          });
        });
      });
      this.tempsAttenteFavs = tempsAttenteFavs;
      this.loadFavoris = false;
      this.dateLastUpdate = new Date().getTime();
      if(refresher){
        refresher.target.complete();
      }
    });
  }

  fetchStationProches(refresher?){
    this.stationProches = [];
    this.loadStationProche = true; 
    this.geolocation.getCurrentPosition().then((position:Geoposition) => {
      this.isErrorLocation = false;
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.ginkoService.fetchStationsProche(this.latitude,this.longitude)
      .subscribe((stations) => {
        this.loadStationProche = false;
        this.stationProches = stations;
        if(refresher){
          refresher.target.complete();
        }
      },
      (err) => {
        this.loadStationProche = false;
        if(refresher){
          refresher.target.complete();
        }
        this.myToast.createToast("ERROR_IMPOSSIBLE_REFRESH",'top');
      });
    },(err) => {
      this.loadStationProche = false;
      this.isErrorLocation = true;
      if(refresher){
        refresher.target.complete();
      }
    });
  } 

  removeFavoris(fav:Station){
    this.favorisService.removeFavoris(fav.name);
  }

  removeTempsAttenteFavoris(tempsAttenteFav:TempsAttenteFav){
    this.favorisService.removeFavorisTempsAttente(tempsAttenteFav);
  }

  itemSelected(station){
    this.router.navigate(['station'], {queryParams: station});
  }


}
