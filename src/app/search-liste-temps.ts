export class SearchListeTemps {
    listeNoms?: string[];
    listeIdLignes?: string[];
    listeSensAller?: boolean[];
    preserverOrdre: boolean;
    nb:number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}