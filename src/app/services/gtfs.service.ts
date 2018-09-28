import { Injectable } from '@angular/core';
import * as papa from 'papaparse';
import { Http } from '@angular/http';
import { ParseConfig } from 'papaparse';
import * as _ from 'lodash';
import {catchError, map} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Trip } from '../models/trip';
import { SpotTime } from '../models/stopTime';
import * as moment from 'moment';
import { CalendarDate } from '../models/calendarDate';


enum TYPE_FILE {
  TRIPS = "trips",
  STOP_TIMES = "stop_times",
  CALENDAR_DATES = "calendar_dates"
};

@Injectable({
  providedIn: 'root'
})
export class GtfsService {

  constructor(private http: Http) { }

  public async fetchSchedule(idLigne:string, idArret:string, direction:string):Promise<SpotTime[]>{
      let schedules:SpotTime[] = [];
      const tripsObservalble = this.readCsvData(TYPE_FILE.TRIPS,idLigne,direction);
      const stopTimesObservalble = this.readCsvData(TYPE_FILE.STOP_TIMES,idArret); 
      const today = moment().format("YYYYMMDD");
      const calendarDatesObservalble = this.readCsvData(TYPE_FILE.CALENDAR_DATES,today);
      let tripsResult:Trip[] = [];
      let calendarDates:CalendarDate[] = await calendarDatesObservalble.toPromise();
      if(calendarDates && calendarDates.length > 0){
        let trips:Trip[] = await tripsObservalble.toPromise();
        if(trips && trips.length > 0){
          calendarDates.forEach((calendarDate:CalendarDate)=> {
            let filterTrips = _.filter(trips, {'service_id':calendarDate.service_id});
            if(filterTrips && filterTrips.length > 0){
              tripsResult = filterTrips;
            }
          });
          if(tripsResult.length > 0){
            let stopTimes:SpotTime[] = await stopTimesObservalble.toPromise();
            tripsResult.forEach((trip:Trip) => {
              let found = _.filter(stopTimes, ['trip_id', trip.trip_id]);
              if(found && found.length > 0){
                schedules.push(found[0]);
               }
            });
          }
        }
      }
      return schedules;
  }

  private readCsvData(typeFile:TYPE_FILE, filterValue:string, optionValue?:string):Observable<any> {
    return this.http.get('assets/'+typeFile+'.csv')
      .pipe( map(
      data => {
        let jsonData = this.extractData(data);
        if(typeFile == TYPE_FILE.TRIPS){
          return _.filter(jsonData, {"route_id":filterValue,"direction_id":optionValue});
        }else if (typeFile == TYPE_FILE.STOP_TIMES){
          let filter = _.filter(jsonData, {"stop_id":filterValue});
          return filter.map((spotTime:any)  => {
            spotTime.arrival_time = this.transformTime(spotTime.arrival_time);
            spotTime.departure_time = this.transformTime(spotTime.departure_time);
             const s: SpotTime = {
              trip_id:spotTime.trip_id,
              arrival_time:moment(spotTime.arrival_time, "HH:mm:ss"),
              departure_time:moment(spotTime.departure_time, "HH:mm:ss"),
              stop_id:spotTime.stop_id,
              stop_sequence:spotTime.stop_sequence,
              stop_headsign:spotTime.stop_headsign,
              pickup_type:spotTime.pickup_type,
              drop_off_type:spotTime.drop_off_type,
              shape_dist_traveled:spotTime.shape_dist_traveled,
              timepoint:spotTime.timepoint,
              }
              return s;
            });
        }else if (typeFile == TYPE_FILE.CALENDAR_DATES){
          return _.filter(jsonData, {"date":filterValue});
        }
      }),
    catchError(this.handleError('fetchStations', []))
  );
}

  private extractData(res) {
    let csvData = res['_body'] || '';
    const config:ParseConfig = {
      header:true
    }
    let parsedData = papa.parse(csvData,config).data;
 
    parsedData.splice(0, 1);
    csvData = parsedData;
    return csvData;
  }

  private transformTime(time:string):string{
    if(time){
      let hour = _.split(time, ':', 1)[0];
      let h = Number(hour);
      let res:number;
      if(h >= 24){
        res = h - 24;
        time = _.replace(time, hour, String("0"+res));
      }
    }
    return time;
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
