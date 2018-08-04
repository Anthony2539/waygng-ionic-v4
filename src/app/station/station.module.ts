import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { StationPage } from './station.page';
import { ComponentsModule } from '../components/components.module';
import { FormatDatePipe } from '../pipe/format-date.pipe';

const routes: Routes = [
  {
    path: '',
    component: StationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [StationPage, FormatDatePipe]
})
export class StationPageModule {}
