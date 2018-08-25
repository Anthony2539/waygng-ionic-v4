import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateDistancePipe } from './calculate-distance.pipe';
import { FormatTypeTransportPipe } from './format-type-transport.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { RemoveDuplicateStationPipe } from './remove-duplicate-station.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatTypeTransportPipe,
    CalculateDistancePipe],
	exports: [RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatTypeTransportPipe,
    CalculateDistancePipe]
})
export class PipesModule { }
