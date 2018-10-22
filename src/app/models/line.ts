import { Variante } from "./variante";

export interface Line {
    id?: string;
    numLignePublic:  string;
    libellePublic: string;
    modeTransport: number;
    couleurFond:string; 
    couleurTexte: string;
    variantes:Variante[];
    periurbain:boolean;
    scolaire:boolean;

}