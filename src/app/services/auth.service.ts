import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import * as firebase from 'firebase';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { User } from '../models/user';
import { take } from 'rxjs/operators';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';

interface UserInfo{
  lastConnection:Date,
  currentVersion:string,
  platforms:string[],
  lastPosition?:any
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFirestore, 
              private ga: GoogleAnalytics, 
              private appVersion: AppVersion, 
              private geolocation: Geolocation,
              private platform:Platform) {

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        const item = this.afs.doc('/users/'+user.uid);
        item.valueChanges().pipe(take(1)).subscribe((user:User) => {
          let userInfo:UserInfo = {lastConnection:new Date(), currentVersion:"web", platforms:this.platform.platforms()};
          if(this.platform.is('android') || this.platform.is('ios')){
            this.appVersion.getVersionNumber().then((version:any) => {
              userInfo.currentVersion = version;
            }); 
            this.geolocation.getCurrentPosition().then((position:Geoposition) => {
              userInfo.lastPosition = {latitude:position.coords.latitude, longitude:position.coords.longitude};
              this.updateOrsetUser(user,userInfo,item);
            },(err) => {
              this.updateOrsetUser(user,userInfo,item);
            });
          }else{
            this.updateOrsetUser(user,userInfo,item)
          }
        });
        this.ga.setUserId(user.uid);
      }
    });

  }

  
  updateOrsetUser(user, userInfo, item){
    if(user){
      item.update(userInfo);
    }else{
      item.set(userInfo);
    }
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
