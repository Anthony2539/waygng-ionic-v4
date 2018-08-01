import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '../../node_modules/angularfire2/firestore';
import { AuthService } from './auth.service';

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
}
