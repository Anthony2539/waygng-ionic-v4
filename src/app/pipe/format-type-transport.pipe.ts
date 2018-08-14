import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTypeTransport'
})
export class FormatTypeTransportPipe implements PipeTransform {

  transform(type:number): string {
    if(type == 0){
      return "titre au voyage";
    }else if (type == 1){
      return "abonnement mensuel";
    }else{
      return "abonnement annuel";
    }
  }

}
