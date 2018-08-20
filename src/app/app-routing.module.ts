import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'map', loadChildren: './pages/map/map.module#MapPageModule', canActivate: [AuthGuard] },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule', canActivate: [AuthGuard] },
  { path: 'station', loadChildren: './pages/station/station.module#StationPageModule', canActivate: [AuthGuard] },
  { path: 'info', loadChildren: './pages/info/info.module#InfoPageModule', canActivate: [AuthGuard] },
  { path: 'tarif', loadChildren: './pages/tarif/tarif.module#TarifPageModule', canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
