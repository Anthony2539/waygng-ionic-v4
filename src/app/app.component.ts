import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

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
    private appRate: AppRate
  ) {
    this.initializeApp(); 
  } 

  initializeApp() {
    this.platform.ready().then(() => {

      // google analytics
      this.ga.startTrackerWithId('UA-125580859-1').then(() => {
        this.appVersion.getVersionCode().then((version:any) => {
          this.ga.setAppVersion(version);
        });
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      }).catch(e => console.log('Error starting GoogleAnalytics', e));

      // this language will be used as a fallback when a translation isn't found in the current language
      this.translate.setDefaultLang('fr');   

      // the lang to use, if the lang isn't available, it will use the current loader to get them
     this.translate.use('fr');

      this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
 
      this.globalization.getPreferredLanguage().then(res => 
        {
          var lang = res.value.split('-');
          this.initTranslate(lang[0]);
        })
      .catch(e => this.initTranslate());


      this.appRate.preferences = {
        usesUntilPrompt: 3,
        storeAppURL: {
         ios: '1042090856'
         //android: 'market://details?id=<package_name>'
        }
      }
      
      this.appRate.promptForRating(false);

    });
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
