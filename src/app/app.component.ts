import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private globalization: Globalization,
    private translate: TranslateService
  ) {
    this.initializeApp(); 
  } 

  initializeApp() {
    this.platform.ready().then(() => {

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
