import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GtfsService } from '../../services/gtfs.service';
import { SpotTime } from '../../models/stopTime';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';

interface Schedule{
  hour:string;
  minutes:Minute[];
}
interface Minute{
  minute:string;
  classIsNow?:string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  dateSelected:string;
  infoLine:any;
  stationName:string;
  schedules:Schedule[] = [];
  loading:boolean = false;

  constructor(private route: ActivatedRoute, 
              private ga: GoogleAnalytics,
              public myToast: MyToastComponent,
              private location: Location,
              private gtfsService:GtfsService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.dateSelected = moment().format("YYYY-MM-DD");
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
        const min = time.format("mm");
        const minute:Minute = {
          minute:min
        }
        let foundHour = _.find(this.schedules,{hour:hour});
        if(!foundHour){
         this.schedules.push({hour:hour, minutes:[minute]})
        }else{
         foundHour.minutes.push(minute);
        }
      });
      this.schedules = _.orderBy(this.schedules ,['hour'], ['asc']); 
      this.colorNextTime();
      this.loading = false;
    },
    (err) => {
      this.myToast.createToast("ERROR_IMPOSSIBLE_LOAD_SCHEDULE", 'top');
      this.loading = false;
    });
  }

  colorNextTime(){
    const now = moment();
    const nowHour = now.format("HH");
    const nowMinute = now.format("mm");
    const foundSchedule:Schedule = _.find(this.schedules, {hour:nowHour});
    if(foundSchedule && foundSchedule.minutes && foundSchedule.minutes.length > 0){
      let found:boolean = false;
      foundSchedule.minutes.forEach((min:Minute, index:number) => {
        if(index > 0){
          if(!found && _.inRange(Number(nowMinute),  Number(foundSchedule.minutes[index-1].minute), Number(min.minute))){
            min.classIsNow = "isNow";
            found = true;
          }
        }else{
          if(Number(nowMinute) <= Number(min)){
            min.classIsNow = "isNow";
            found = true;
          }
        }
      });
      if(!found){
        if(Number(foundSchedule.minutes[foundSchedule.minutes.length-1].minute) <= Number(nowMinute)){
          const index = _.indexOf(this.schedules, foundSchedule);
          if(index < this.schedules.length - 1){
            if(this.schedules[index+1].minutes.length > 0){
              this.schedules[index+1].minutes[0].classIsNow = "isNow";
            }
          }else{
            if(this.schedules[0].minutes.length > 0){
              this.schedules[0].minutes[0].classIsNow = "isNow";
            }
          }
        }
      }
    }
  }

  goBack(){
    this.location.back();
  }

}
