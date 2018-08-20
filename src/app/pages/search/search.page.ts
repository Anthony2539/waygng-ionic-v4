import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Station } from '../../models/station';
import { GinkoService } from '../../services/ginko.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  allStations: Station[] = [];
  stations: Station[] = [];
  loading: any = false;

  constructor(private ginkoService: GinkoService, private router: Router) { }

  ngOnInit() {
    this.getStations(); 
  }

  getStations(){
    this.loading = true;
     this.ginkoService.fetchStations().subscribe(stations => {
       this.allStations = stations;
       this.stations = stations;
       this.loading = false;
      });
  }

  filterItems(ev) {

    this.stations = this.allStations;
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.stations = this.stations.filter((station) => {
        return (station.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  onCancel(ev){
    this.router.navigate(['']);
  }

  itemSelected(station){
    this.router.navigate(['station'], {queryParams: station});
  }

}
