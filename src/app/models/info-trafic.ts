import { InfoLigne } from "./info-ligne";
import { ComplementInfo } from "../pages/info/info.page";

export class InfoTrafic {
    id: number;
    titre: string;
    texte: string;
    complement: string;
    url: string;
    tempsReel: boolean;
    alerte:  boolean;
    lignes: InfoLigne[];
    complementInfos?:ComplementInfo[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
