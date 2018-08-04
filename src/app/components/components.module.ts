import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { MyHeaderLoaderComponent } from './my-header-loader/my-header-loader.component';
import { MyToastComponent } from './my-toast/my-toast.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [MyLoaderComponent, MyToastComponent, MyHeaderLoaderComponent],
  exports: [MyLoaderComponent,MyToastComponent, MyHeaderLoaderComponent],
  entryComponents: [],
})
export class ComponentsModule {}
