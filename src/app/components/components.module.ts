import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { MyHeaderLoaderComponent } from './my-header-loader/my-header-loader.component';
import { MyToastComponent } from './my-toast/my-toast.component';
import { GinkoInfoComponent } from './ginko-info/ginko-info.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [MyLoaderComponent, MyToastComponent, MyHeaderLoaderComponent, GinkoInfoComponent],
  exports: [MyLoaderComponent,MyToastComponent, MyHeaderLoaderComponent, GinkoInfoComponent],
  entryComponents: [GinkoInfoComponent],
})
export class ComponentsModule {}
