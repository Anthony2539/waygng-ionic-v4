import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { User } from '../models/user';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFirestore, private ga: GoogleAnalytics) {

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        const item = this.afs.doc('/users/'+user.uid);
        item.valueChanges().pipe(take(1)).subscribe((user:User) => {
          if(user){
            item.update({"lastConnection":new Date()});
          }else{
            item.set({"lastConnection":new Date()});
          }
        });
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
