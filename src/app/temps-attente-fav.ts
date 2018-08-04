import { Station } from "./station";

export class TempsAttenteFav {
    idArret: string;
    idLigne:  string;
    numLignePublic: string;
    couleurFond: string;
    couleurTexte: string;
    sensAller: boolean;
    destination: string;
    temps?: string;
    station:Station;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}