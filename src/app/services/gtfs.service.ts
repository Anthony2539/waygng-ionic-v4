import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { SpotTime } from '../models/stopTime';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GtfsService {

  constructor(private http: HttpClient) { }

  fetchSchedule(idLigne:string, idArret:string, direction:string, dateSelected:string):Observable<SpotTime[]> {

    let url = `https://us-central1-waygng-dev-2e25c.cloudfunctions.net/app/gtfs`

    const params = new HttpParams({
      fromObject: {
        route_id: idLigne,
        stop_id: idArret,
        direction_id:direction,
        date: dateSelected
      }
  });

    return this.http.get<SpotTime[]>(url,{params: params});

  }

}
