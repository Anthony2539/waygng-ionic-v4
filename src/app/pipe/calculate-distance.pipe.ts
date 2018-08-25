import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDistance'
})
export class CalculateDistancePipe implements PipeTransform {

  transform(latLong: string, myLatitude:string, myLongitude:string) {
    let latLongLst = latLong.split(";");
    let latitude = latLongLst[0];
    let longitude = latLongLst[1];
    let p = Math.PI / 180;
    let c = Math.cos;
    let a = 0.5 - c((Number(myLatitude)-Number(latitude)) * p) / 2 + c(Number(latitude) * p) *c((Number(myLatitude)) * p) * (1 - c(((Number(myLongitude)- Number(longitude)) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    if(dis > 1){
      return Math.round(dis)+" Km";
    }else{
      return Math.round(dis * 1000)+" m";
    }
  }

}
