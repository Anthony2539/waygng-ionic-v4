import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search/search.page';
import { SearchPageModule } from './search/search.module';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'search', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'station', loadChildren: './station/station.module#StationPageModule' },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'tarif', loadChildren: './tarif/tarif.module#TarifPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
