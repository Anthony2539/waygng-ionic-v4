import { Station } from "./station";

export class Favoris {
    station:Station;
    isStation:boolean;
    idArret?: string;
    idLigne?:  string;
    numLignePublic?: string;
    couleurFond?: string;
    couleurTexte?: string;
    sensAller?: boolean;
    destination?: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}