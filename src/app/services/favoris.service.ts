import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Station } from '../models/station';
import { TempsAttenteFav } from '../models/temps-attente-fav';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Injectable({
  providedIn: 'root'
})
export class FavorisService {

  private user:firebase.User

  constructor(private afs: AngularFirestore, private ga: GoogleAnalytics) { 
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  getFavorisList(): AngularFirestoreCollection<any>{
    return this.afs.collection('/users/'+this.user.uid+'/stations');
   }

   getFavorisTempsAttenteList(stationId?:string): AngularFirestoreCollection<TempsAttenteFav>{
    if(stationId){
      return this.afs.collection('/users/'+this.user.uid+'/tempsAttenteFavs', ref => ref.where('station.id','==',stationId));
    }
    return this.afs.collection('/users/'+this.user.uid+'/tempsAttenteFavs', ref => ref.orderBy('station.name'));
   } 

  getFavoris(nomStation): AngularFirestoreCollection<any> {
    return this.afs.collection('/users/'+this.user.uid+'/stations', ref => ref.where('name', '==', nomStation));
  }

  addFavoris(station:Station){
    this.ga.trackEvent("ADD FAVORIS", station.name);
    const items = this.afs.collection('/users/'+this.user.uid+'/stations/');
    return items.add(station);
  }

  addFavorisTempsAttente(tempsAttenteFav:TempsAttenteFav){
    this.ga.trackEvent("ADD FAVORIS", tempsAttenteFav.idLigne+"-"+tempsAttenteFav.idArret);
    const items = this.afs.collection('/users/'+this.user.uid+'/tempsAttenteFavs/');
    return items.add(tempsAttenteFav);
  }

  removeFavorisTempsAttente(tempsAttenteFav:TempsAttenteFav){
    this.ga.trackEvent("REMOVE FAVORIS", tempsAttenteFav.idLigne+"-"+tempsAttenteFav.idArret);
    const items = this.afs.collection('/users/'+this.user.uid+'/tempsAttenteFavs/', ref => ref.where('idArret','==',tempsAttenteFav.idArret).where('sensAller','==',tempsAttenteFav.sensAller).where('idLigne','==',tempsAttenteFav.idLigne));
    items.snapshotChanges().pipe(take(1)).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        items.doc(snapshot.payload.doc.id).delete();
      });
    });
  }

  removeFavoris(nomStation){
    this.ga.trackEvent("REMOVE FAVORIS", nomStation);
    const itemsCollection  = this.getFavoris(nomStation);
    itemsCollection.snapshotChanges().pipe(take(1)).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        itemsCollection.doc(snapshot.payload.doc.id).delete();
      });
    });

  }


}
