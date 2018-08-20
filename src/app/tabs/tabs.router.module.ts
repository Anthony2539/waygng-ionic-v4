import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../pages/home/home.page';
import { SearchPage } from '../pages/search/search.page';
import { MapPage } from '../pages/map/map.page';
import { InfoPage } from '../pages/info/info.page';
import { TarifPage } from '../pages/tarif/tarif.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'search',
        outlet: 'search',
        component: SearchPage
      },
      {
        path: 'map',
        outlet: 'map',
        component: MapPage
      },
      {
        path: 'info',
        outlet: 'info',
        component: InfoPage
      },
      {
        path: 'tarif',
        outlet: 'tarif',
        component: TarifPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  },
  {
    path: 'search',
    redirectTo: '/tabs/(search:search)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
