import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../models/station';
import * as _ from 'lodash';

@Pipe({
  name: 'removeDuplicateStation'
})
export class RemoveDuplicateStationPipe implements PipeTransform {

  transform(stations: Station[], ...args) {
    return _.uniqWith(stations, function(first, second){
      return first.name === second.name;
    });
  }

}
