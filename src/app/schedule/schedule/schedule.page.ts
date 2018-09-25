import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GtfsService } from '../../services/gtfs.service';
import { SpotTime } from '../../models/stopTime';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  infoLine:any;
  stationName:string;

  constructor(private route: ActivatedRoute, 
              private location: Location,
              private gtfsService:GtfsService) { }

  ngOnInit() {
    this.infoLine = this.route.snapshot.queryParams;
    this.stationName = this.infoLine.stationName;
    this.gtfsService.fetchSchedule(this.infoLine.idLigne,this.infoLine.idArret,this.infoLine.sensAller).then((stopTimes:SpotTime[]) =>{
     let orderStopTime = _.orderBy(stopTimes,['departure_time'], ['asc']); 
      console.log(orderStopTime);
    });
  }

  goBack(){
    this.location.back();
  }

}
