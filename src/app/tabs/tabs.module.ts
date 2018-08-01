import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { HomePageModule } from '../home/home.module';
import { SearchPageModule } from '../search/search.module';
import { MapPageModule } from '../map/map.module';
import { InfoPageModule } from '../info/info.module';
import { TarifPageModule } from '../tarif/tarif.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    SearchPageModule,
    MapPageModule,
    InfoPageModule,
    TarifPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
