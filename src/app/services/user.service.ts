import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import * as firebase from 'firebase/app';
import { Favoris } from '../models/favoris';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user:firebase.User;

  docRef: AngularFirestoreDocument;

  constructor(private afs: AngularFirestore, private ga: GoogleAnalytics) { 
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.docRef = this.afs.doc(`users/`+this.user.uid);
      }
    });
  }

  getUser():Observable<any>{
    return this.docRef.valueChanges();
  }

  sortFavoris(favorisList:Favoris[]) {
    this.docRef.update({favs:favorisList}); 
  }

  addFavoris(favoris:Favoris){
    this.docRef.update({ 
      favs: firestore.FieldValue.arrayUnion(favoris) 
    })
  }

  removeFavoris(favoris:Favoris){
    this.docRef.update({ 
      favs:  firestore.FieldValue.arrayRemove(favoris) 
    })
  }
}
