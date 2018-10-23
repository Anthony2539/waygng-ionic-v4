import { Component, ViewChild } from '@angular/core';
import { Platform, List } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Station } from '../../models/station';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { GinkoService } from '../../services/ginko.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { SearchListeTemps } from '../../models/search-liste-temps';
import { StationAttente } from '../../models/station-attente';
import { TempsAttente } from '../../models/temps-attente';
import { Router } from '@angular/router';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AdMobFree , AdMobFreeInterstitialConfig} from '@ionic-native/admob-free/ngx';
import { Favoris } from '../../models/favoris';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FavorisTemps } from '../../models/favorisTemps';
import * as _ from 'lodash';
import { Line } from '../../models/line';
import { Variante } from '../../models/variante';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {

  @ViewChild('slidingList') slidingList: List;
  
  loadFavoris: boolean = false;
  favorisTemps: FavorisTemps[] = [];
  favoris: Favoris[] = [];
  loadStationProche: boolean = false;
  stationProches: Station[] = [];
  latitude: number;
  longitude: number;
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
    public userService: UserService) {


}

  ngOnInit() {
    this.ga.trackView('Home page');
    let mapStationLines = new Map<string, Line[]>();
    this.ginkoService.fetchLines().subscribe((lines:Line[]) => {
      lines.forEach((line:Line) => {
        if(!line.periurbain && line.variantes && line.variantes.length > 0){
          line.variantes.forEach((variante:Variante) => {
            this.ginkoService.fetchVariantes(line.id, variante.id).subscribe((stations:Station[]) => {
              stations.forEach((station:Station) => {
                if(mapStationLines.has(station.name)){
                  let linesTmp:Line[] = mapStationLines.get(station.name);
                  const found = _.find(linesTmp, line);
                  if(!found){
                    linesTmp.push(line);
                  }
                  mapStationLines.set(station.name,linesTmp);
                }else{
                  let linesTmp:Line[] = [];
                  mapStationLines.set(station.name,linesTmp);
                }
              });
            }); 
          });
        }
      });
    });
    console.log(mapStationLines);
    this.platform.ready().then(() => { 
      this.showInterstitialAd();
      this.fetchStationProches();
      this.getFavoris();
    });
  }

  showInterstitialAd(){
    let interstitialConfig: AdMobFreeInterstitialConfig = {};
    if(this.platform.is('android')) {

    } else if (this.platform.is('ios')) {
      interstitialConfig = {
        id:'ca-app-pub-6685491124399341/4886403246',
        isTesting: false,
        autoShow: true
       }
       
      this.adMobFree.interstitial.config(interstitialConfig);
      this.adMobFree.interstitial.prepare();
    }

  }


  doRefresh(refresher){
    this.fetchStationProches(refresher);
    this.getFavoris(refresher);
  }

  getFavoris(refresher?){
    this.userService.getUser().subscribe((user:User) => {
       this.favorisTemps = [];
       if(user && user.favs && user.favs.length > 0){
        let favoris = user.favs;
        let searchListeTemps:SearchListeTemps = {listeNoms:[], listeIdLignes:[], listeSensAller:[], preserverOrdre:true,nb:1};
        favoris.forEach(fav => {
          this.favorisTemps.push({favoris:fav});
          if(!fav.isStation){
            searchListeTemps.listeNoms.push(fav.station.name);
            searchListeTemps.listeIdLignes.push(fav.idLigne);
            searchListeTemps.listeSensAller.push(fav.sensAller);
          }
        });
  
        this.ginkoService.fetchListeTemps(searchListeTemps).subscribe((stationAttentes:StationAttente[]) => {
          this.favorisTemps.forEach((favorisTemps:FavorisTemps) => {
            if(!favorisTemps.favoris.isStation){
              stationAttentes.forEach((stationAttente:StationAttente) => {
                if(stationAttente.nomExact == favorisTemps.favoris.station.name && stationAttente.listeTemps && stationAttente.listeTemps.length > 0){
                  stationAttente.listeTemps.forEach((tempsAttente:TempsAttente) =>{
                    if(favorisTemps.favoris.idArret == tempsAttente.idArret && favorisTemps.favoris.idLigne == tempsAttente.idLigne && favorisTemps.favoris.sensAller == tempsAttente.sensAller){
                      favorisTemps.temps = tempsAttente.temps;
                    }
                  });
                }
              });
            }
          });
        });
        this.favoris = favoris;
      }
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

  async removeFavoris(fav:Favoris){
    this.userService.removeFavoris(fav);
    await this.slidingList.closeSlidingItems();
  }

  async removeTempsAttenteFavoris(fav:Favoris){
    this.userService.removeFavoris(fav);
    await this.slidingList.closeSlidingItems();
  }

  itemSelected(station){
    this.router.navigate(['station'], {queryParams: station});
  }

   toggleEdit() {
    const reorderGroup:any = document.getElementById('reorder');
    reorderGroup.disabled = !reorderGroup.disabled;
    if(!reorderGroup.disabled){
      this.myToast.createToast("REORDER_FAVORITES",'top');
    }
  }

  reorderItems(indexes : any){
    this.ga.trackEvent("SORT FAVORIS","");
    const next = this.favoris;
    const moved = next.splice(indexes.detail.from, 1);
    next.splice(indexes.detail.to, 0, moved[0]);
    this.userService.sortFavoris(next);
  }


}
