import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpModule } from '@angular/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { FIREBASE_CONFIG } from './app.firebase.config';

// ANGULAR FIRE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { FavorisService } from './favoris.service';
import { GinkoService } from './ginko.service';
import { MyToastComponent } from './components/my-toast/my-toast.component';
import { FormatDatePipe } from './pipe/format-date.pipe';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
            BrowserModule, 
            HttpModule,
            HttpClientModule,
            IonicModule.forRoot(), 
            TranslateModule.forRoot({
              loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
              }
            }),
            AngularFirestoreModule,
            AngularFireModule.initializeApp(FIREBASE_CONFIG),
            AngularFireAuthModule,
            AngularFireDatabaseModule,
            AppRoutingModule
          ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    FavorisService,
    GinkoService,
    MyToastComponent,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
