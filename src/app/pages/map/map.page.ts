import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsEvent
} from '@ionic-native/google-maps';
import { GinkoService } from '../../services/ginko.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';
import { Station } from '../../models/station';
import * as _ from 'lodash';
import { LoadingOptions } from '@ionic/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  station:Station;
  isErrorLocation:boolean=false;
  map: GoogleMap;
  loading: any;
  stationsAdded:Station[];

  constructor(private platform: Platform, 
              private route: ActivatedRoute, 
              private ginkoService: GinkoService, 
              public geolocation: Geolocation,
              public loadingCtrl: LoadingController, 
              public myToast: MyToastComponent) { }

  async ngOnInit() {
    this.stationsAdded = [];
    this.station = this.route.snapshot.queryParams as Station;
    if(this.station){
      alert(this.station.name); 
    } 
    const opts:LoadingOptions = {message:"Chargement", translucent: true};
    this.loading = await this.loadingCtrl.create(opts);
    await this.loading.present();
    await this.platform.ready();
    await this.initMap();
}

initMap(){

  this.geolocation.getCurrentPosition().then((position:Geoposition) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    this.ginkoService.fetchStationsProche(latitude,longitude).subscribe((stations:Station[]) => {
      this.loadMap(latitude,longitude,stations);
    },
    (err) => {
      this.myToast.createToast("ERROR_IMPOSSIBLE_REFRESH", 'top');
    });
  },(err) => {
    this.loading.dismiss();
    this.isErrorLocation = true;
  });
}

loadMap(latitude:number,longitude:number,stations:Station[]) {
  const mapOptions: GoogleMapOptions = {
    camera: {
      target: {
        lat: latitude,
        lng: longitude
      },
      zoom: 15,
      tilt: 30
    },
    controls: {
      compass: true,
      myLocationButton: true,
      myLocation: true,
      indoorPicker: false
    }
  };


  this.map = GoogleMaps.create('map_canvas', mapOptions);


  // Wait the MAP_READY before using any methods.
  this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    this.loading.dismiss();
    stations = this.removeDuplicate(stations);
    stations.forEach((station) =>{
      this.stationsAdded.push(station);
      this.map.addMarkerSync({
        title: station.name,
        icon: 'red',
        position: {
          lat: Number(station.latitude),
          lng: Number(station.longitude)
        },
        
      });
    });

    this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((location) => {
      this.ginkoService.fetchStationsProche(location[0].target.lat,location[0].target.lng).subscribe((stations:Station[]) => {
          this.addStations(stations);
        });
      });
    });
  }

  addStations(stations:Station[]){
    stations = this.removeDuplicate(stations);
    // Now you can use all methods safely.
    stations.forEach((station) =>{
      if(!_.find(this.stationsAdded, station)){
        this.map.addMarkerSync({
          title: station.name,
          icon: 'red',
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude)
          },
          
        });   
        this.stationsAdded.push(station);
      }
    });
  }

  removeDuplicate(stations:Station[]):Station[]{
    return _.uniqWith(stations, function(first, second){
      return first.name === second.name;
    });
  }


}
