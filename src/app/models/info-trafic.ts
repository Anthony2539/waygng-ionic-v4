import { InfoLigne } from "./info-ligne";

export class InfoTrafic {
    id: number;
    titre: string;
    texte: string;
    complement: string;
    url: string;
    tempsReel: boolean;
    alerte:  boolean;
    lignes: InfoLigne[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
