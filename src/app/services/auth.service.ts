import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFirestore, private ga: GoogleAnalytics) {

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        const item = this.afs.doc('/users/'+user.uid);
        item.update({"lastConnection":new Date()});
        this.ga.setUserId(user.uid);
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
