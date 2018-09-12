import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
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
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AdMobFree , AdMobFreeInterstitialConfig} from '@ionic-native/admob-free/ngx';


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
    private platform: Platform,
    private ga: GoogleAnalytics,
    private adMobFree: AdMobFree,
    public auth: AuthService,
    private router: Router,
    public myToast: MyToastComponent,
    public geolocation: Geolocation,
    public ginkoService: GinkoService,
    public favorisService: FavorisService) {


}

  ngOnInit() {
    this.ga.trackView('Home page');

    let interstitialConfig: AdMobFreeInterstitialConfig = {};
    if(this.platform.is('android')) {

    } else if (this.platform.is('ios')) {
      interstitialConfig = {
        id:'ca-app-pub-6685491124399341/2999824124',
        isTesting: true,
        autoShow: false
       }
    }

    this.adMobFree.interstitial.config(interstitialConfig);
    this.platform.ready().then(() => {
      this.adMobFree.interstitial.prepare().then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        setTimeout(() => {
          this.adMobFree.interstitial.show();
        },2000)
      }).catch(e => {
        console.log(e);
      });
    });
    

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
