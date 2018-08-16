export class Tarif {
    public type: number;
    public libelle: string;
    public description: string;
    public pointsDeVente: string;
    public tarif: number;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
    
    
}