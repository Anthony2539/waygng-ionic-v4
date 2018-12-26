import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
                   {
                     path: '',
                     loadChildren: '../pages/home/home.module#HomePageModule'
                   }
                  ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: '../pages/search/search.module#SearchPageModule'
          }
         ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: '../pages/map/map.module#MapPageModule'
          }
         ]
      },
      {
        path: 'map/:id',
        children: [
          {
            path: '',
            loadChildren: '../pages/map/map.module#MapPageModule'
          }
         ]
      },
      {
        path: 'info',
        children: [
          {
            path: '',
            loadChildren: '../pages/info/info.module#InfoPageModule'
          }
         ]
      },
      {
        path: 'tarif',
        children: [
          {
            path: '',
            loadChildren: '../pages/tarif/tarif.module#TarifPageModule'
          }
         ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  { 
    path: 'search',
    redirectTo: '/tabs/search',
    pathMatch: 'full'
  },
  {
    path: 'map/:id',
    redirectTo: '/tabs/map/:id',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
