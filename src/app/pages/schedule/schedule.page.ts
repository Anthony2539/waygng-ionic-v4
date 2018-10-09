import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GtfsService } from '../../services/gtfs.service';
import { SpotTime } from '../../models/stopTime';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

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

  maxDate:string;
  dateSelected:string;
  infoLine:any;
  stationName:string;
  schedules:Schedule[] = [];
  loading:boolean = false;

  constructor(private route: ActivatedRoute, 
              private ga: GoogleAnalytics,
              private location: Location,
              private gtfsService:GtfsService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.dateSelected = moment().format("YYYY-MM-DD");
      this.maxDate = "2018-10-15";
      this.infoLine = params["params"];
      const today = moment().format("YYYYMMDD");
      this.goSchedule(today);
      this.ga.trackView("Schedule page: Ligne="+this.infoLine.idLigne+" Arret="+this.infoLine.idArret+" sens="+this.infoLine.sensAller);
    });
    
  }

  onChangeDate(){
    let month = this.dateSelected["month"].value;
    if(month < 10){
      month = "0"+month;
    }
    this.goSchedule(this.dateSelected["year"].text+month+this.dateSelected["day"].text);
  }

  goSchedule(dateSelected:string){
    this.ga.trackEvent("SCHEDULE CHANGE DATE", dateSelected);
    this.loading = true;
    this.stationName = this.infoLine.stationName;
    this.schedules = [];
    this.gtfsService.fetchSchedule(this.infoLine.idLigne,this.infoLine.idArret,this.infoLine.sensAller,dateSelected).subscribe( (stopTimes:SpotTime[]) => {
      stopTimes.forEach((stopTime:SpotTime) => {
        const time = moment(stopTime.departure_time, "HH:mm:ss");
        let hour = time.format("HH");
        const minute = time.format("mm");
        let foundHour = _.find(this.schedules,{hour:hour});
        if(!foundHour){
         this.schedules.push({hour:hour, minutes:[minute]})
        }else{
         foundHour.minutes.push(minute);
        }
      });
      this.schedules = _.orderBy(this.schedules ,['hour'], ['asc']); 
      this.loading = false;
    });
  }

  goBack(){
    this.location.back();
  }

}
