import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Station } from '../../models/station';
import { GinkoService } from '../../services/ginko.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { MyToastComponent } from '../../components/my-toast/my-toast.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('searchBar') searchBar: any;  

  allStations: Station[] = [];
  stations: Station[] = [];
  loading: any = false;

  constructor(private ginkoService: GinkoService,
              private ga: GoogleAnalytics, 
              public myToast: MyToastComponent,
              private router: Router) { }

  ngOnInit() {
    this.ga.trackView('Search page');
    this.getStations(); 
  }

  getStations(){
    this.loading = true;
     this.ginkoService.fetchStations().subscribe(stations => {
       this.allStations = stations;
       this.stations = stations;
       this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.myToast.createToast("ERROR_IMPOSSIBLE_REFRESH", 'top');
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

    const event:any = (new window['Event']('resize') as any);
    window.dispatchEvent(event);
  }

  onCancel(ev){
    this.router.navigate(['']);
  }

  itemSelected(station){
    this.router.navigate(['station'], {queryParams: station});
  }


}
