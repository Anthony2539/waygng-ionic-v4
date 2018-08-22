import { InfoTrafic } from "./info-trafic";

export class InfosTrafic {

    infosAnticipees: InfoTrafic[];
    infosTempsReel: InfoTrafic[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
