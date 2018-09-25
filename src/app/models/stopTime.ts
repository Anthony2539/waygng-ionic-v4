import { Moment } from "moment";

export interface SpotTime{
    trip_id:string;
    arrival_time:Moment;
    departure_time:Moment;
    stop_id:string;
    stop_sequence:string;
    stop_headsign?:string;
    pickup_type?:string;
    drop_off_type?:string;
    shape_dist_traveled?:string;
    timepoint?:string;
}