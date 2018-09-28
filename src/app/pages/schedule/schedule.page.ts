import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GtfsService } from '../../services/gtfs.service';
import { SpotTime } from '../../models/stopTime';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

interface Schedule{
  hour:string;
  minutes:string[];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  today:string;
  infoLine:any;
  stationName:string;
  schedules:Schedule[] = [];
  loading:boolean = false;

  constructor(private route: ActivatedRoute, 
              private location: Location,
              private gtfsService:GtfsService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.loading = true;
      this.today = moment().format("dddd");
      this.infoLine = params["params"];
      this.goSchedule();
    });
    
  }

  goSchedule(){
    this.stationName = this.infoLine.stationName;
    this.gtfsService.fetchSchedule(this.infoLine.idLigne,this.infoLine.idArret,this.infoLine.sensAller).then((stopTimes:SpotTime[]) =>{
     let orderStopTime = _.orderBy(stopTimes,['departure_time'], ['asc']); 
     orderStopTime.forEach((stopTime:SpotTime) => {
       let hour = stopTime.departure_time.format("HH");
       const minute = stopTime.departure_time.format("mm");
       let foundHour = _.find(this.schedules,{hour:hour});
       if(!foundHour){
        this.schedules.push({hour:hour, minutes:[minute]})
       }else{
        foundHour.minutes.push(minute);
       }
     });
     this.loading = false;
    });
  }

  goBack(){
    this.location.back();
  }

}
