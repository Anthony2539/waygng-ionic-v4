import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { Line } from './models/line';
import { Variante } from './models/variante';
import { Station } from './models/station';
import { GinkoService } from './services/ginko.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as _ from 'lodash';
import * as moment from 'moment';

interface MapStationLines{
  nameStation:string;
  lines:Line[];
}


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private appVersion: AppVersion,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalization: Globalization,
    private translate: TranslateService,
    private ga: GoogleAnalytics,
    private ginkoService: GinkoService,
    private appRate: AppRate,
    private nativeStorage: NativeStorage
  ) {
    this.initializeApp(); 
  } 

 

  initializeApp() {
    this.platform.ready().then(() => {

      this.initGoogleAnalytics();

      // this language will be used as a fallback when a translation isn't found in the current language
      this.translate.setDefaultLang('fr');   

      // the lang to use, if the lang isn't available, it will use the current loader to get them
     this.translate.use('fr');

      this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
 
      this.initPreferredLanguage();

      this.initAppRate();

      this.initStationsByLines();

    });
  }

  initStationsByLines(){
    //this.nativeStorage.clear();
    this.nativeStorage.getItem('mapStationLines').then(
      data => {
        if(data){
          console.log("stations by lines loaded !");
        }
      },
      async error => {
        let mapStationLines:MapStationLines[] = [];
        let lines = await this.ginkoService.fetchLines().toPromise();
    
        await Promise.all(lines.map(async (line) => {
          if(!line.periurbain && line.variantes && line.variantes.length > 0){
            await Promise.all(line.variantes.map(async (variante) => {
              let stations = await this.ginkoService.fetchVariantes(line.id, variante.id).toPromise();
              await Promise.all(stations.map(async (station) => {
                let stationLines:any = _.find(mapStationLines,{nameStation:station.name});
                if(stationLines){
                  let linesTmp:Line[] = stationLines.lines;
                  const found = _.find(linesTmp, line);
                  if(!found){
                    linesTmp.push(line);
                  }
                  const index = _.findIndex(mapStationLines,{nameStation:station.name});
                  mapStationLines[index].lines = linesTmp;
                }else{
                  mapStationLines.push({nameStation:station.name,lines:[line]});
                }
              }));
            }));
          }
        }));
        this.nativeStorage.setItem('mapStationLines', mapStationLines);
      });

  }

  initGoogleAnalytics(){
    // google analytics
    this.ga.startTrackerWithId('UA-125580859-1').then(() => {
      if(this.platform.is('android') || this.platform.is('ios')){
        this.appVersion.getVersionNumber().then((version:any) => {
          this.ga.setAppVersion(version);
        });
      }
      // Tracker is ready
      // You can now track pages or set additional information such as AppVersion or UserId
    }).catch(e => console.log('Error starting GoogleAnalytics', e));
}

initPreferredLanguage(){
  this.globalization.getPreferredLanguage().then(res => 
    {
      var lang = res.value.split('-');
      this.initTranslate(lang[0]);
    })
  .catch(e => this.initTranslate());
}

initAppRate(){
  this.appRate.preferences = {
    simpleMode: true,
    displayAppName: 'Waygng',
    promptAgainForEachNewVersion: true,
    usesUntilPrompt: 2,
    storeAppURL: {
      ios: '1042090856',
      android: 'market://details?id=com.waygetandgo'
    },
    customLocale: {
      title: "Voulez-vous noter %@?",
      message: "Cela ne prendra pas plus d’une minute et nous aidera à promouvoir notre application. Merci pour votre aide!",
      cancelButtonLabel: "Non, merci",
      laterButtonLabel: "Me le rappeler plus-tard",
      rateButtonLabel: "Noter maintenant",
      yesButtonLabel: "Yes!",
      noButtonLabel: "Not really",
      appRatePromptTitle: 'Do you like using %@',
      feedbackPromptTitle: 'Mind giving us some feedback?'
    }
  };

  // Opens the rating immediately no matter what preferences you set
  this.appRate.promptForRating(false);
}

  initTranslate(lang?:string) {
    // Set the default language for translation strings, and the current language.
    if (lang !== undefined) {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      moment.locale(lang);
    } else {
      this.translate.setDefaultLang('fr');
      this.translate.use('fr'); // Set your language here
      moment.locale('fr');
    }
}
}
