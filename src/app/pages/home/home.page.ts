import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavorisService } from '../../services/favoris.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  loadFavoris: boolean = false;
  favoris: any[] = [];

  constructor(
    public auth: AuthService,
    public favorisService: FavorisService) {
      this.getFavoris();

}



  getFavoris(){
    this.loadFavoris = true;
    const unsubscribe: firebase.Unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.favorisService.getFavorisList().valueChanges().subscribe((favoris) => {
          this.favoris = favoris;
        }); 

        //this.getFavorisTempsAttente(null);

        unsubscribe();
      } else {
        this.auth.createAnonymousUser();
        unsubscribe();
      }
   }); 

  }

}
