import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFirestore) {

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        const item = this.afs.doc('/users/'+user.uid);
        item.set({"lastConnection":new Date()});
      }
    });

  }
  

  createAnonymousUser(): Promise<any> {
    return firebase.auth().signInAnonymously();
  }

  getCurrentUser():firebase.User{
    return firebase.auth().currentUser;
  }


  logout() {
    firebase.database().goOffline();
   }
}
