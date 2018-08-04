export class InfoLigne {
    idLigne: string;
    numLignePublic: string;
    couleurFond: string;
    couleurTexte: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}