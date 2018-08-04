import { TempsAttente } from './temps-attente';

export class StationAttente {
    public nomExact: string;
    public listeTemps: TempsAttente[];
    public latitude: number;
    public longitude: number; 


    constructor(nomExact: string, listeTemps: TempsAttente[]){
        this.nomExact = nomExact;
        this.listeTemps = listeTemps;
    }
    
    
}