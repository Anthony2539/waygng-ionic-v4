import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(timestamp: number, mode:String) {
    if(timestamp){
      let timestampStr = timestamp.toString().replace("-","");
      timestamp = Number(timestampStr);
      var day = moment(timestamp);
      if(mode == "relative"){
        return day.fromNow();
      }else if(mode == "calendar"){
        return day.calendar();
      }

    }
  }

}
