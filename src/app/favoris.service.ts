import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { Station } from './station';
import { take } from '../../node_modules/rxjs/operators';
import { TempsAttenteFav } from './temps-attente-fav';

@Injectable({
  providedIn: 'root'
})
export class FavorisService {

  constructor(private afs: AngularFirestore, private auth:AuthService) { 
    
  }

  getFavorisList(): AngularFirestoreCollection<any>{
    let user:firebase.User = this.auth.getCurrentUser();
    return this.afs.collection('/users/'+user.uid+'/stations');
   }

   getFavorisTempsAttenteList(stationId?:string): AngularFirestoreCollection<TempsAttenteFav>{
    let user:firebase.User = this.auth.getCurrentUser();
    if(stationId){
      return this.afs.collection('/users/'+user.uid+'/tempsAttenteFavs', ref => ref.where('station.id','==',stationId));
    }
    return this.afs.collection('/users/'+user.uid+'/tempsAttenteFavs', ref => ref.orderBy('station.name'));
   } 

  getFavoris(nomStation): AngularFirestoreCollection<any> {
    let user:firebase.User = this.auth.getCurrentUser();
    return this.afs.collection('/users/'+user.uid+'/stations', ref => ref.where('name', '==', nomStation));
  }

  addFavoris(station:Station){
    let user:firebase.User = this.auth.getCurrentUser();
    const items = this.afs.collection('/users/'+user.uid+'/stations/');
    return items.add(station);
  }

  addFavorisTempsAttente(tempsAttenteFav:TempsAttenteFav){
    let user:firebase.User = this.auth.getCurrentUser();
    const items = this.afs.collection('/users/'+user.uid+'/tempsAttenteFavs/');
    return items.add(tempsAttenteFav);
  }

  removeFavorisTempsAttente(tempsAttenteFav:TempsAttenteFav){
    let user:firebase.User = this.auth.getCurrentUser();
    const items = this.afs.collection('/users/'+user.uid+'/tempsAttenteFavs/', ref => ref.where('idArret','==',tempsAttenteFav.idArret).where('sensAller','==',tempsAttenteFav.sensAller).where('idLigne','==',tempsAttenteFav.idLigne));
    items.snapshotChanges().pipe(take(1)).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        items.doc(snapshot.payload.doc.id).delete();
      });
    });
  }

  removeFavoris(nomStation){

    const itemsCollection  = this.getFavoris(nomStation);
    itemsCollection.snapshotChanges().pipe(take(1)).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        itemsCollection.doc(snapshot.payload.doc.id).delete();
      });
    });

  }


}
