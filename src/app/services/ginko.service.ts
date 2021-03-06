import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Station } from '../models/station';
import { StationAttente } from '../models/station-attente';
import { SearchListeTemps } from '../models/search-liste-temps';

import { Observable, of } from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import { InfosTrafic } from '../models/infos-trafic';
import { Line } from '../models/line';
 
@Injectable({
  providedIn: 'root'
})
export class GinkoService {

  private urlGinko = 'https://api.ginko.voyage';

  constructor(public http: HttpClient) {

  }

    fetchStations():Observable<any> {
      const url = this.urlGinko+"/DR/getArrets.do";
      return this.http.get<any>(url).pipe(
        map(response => {
          return response.objets.map(station  => {
            const s: Station = {
                id:station.id,
                name:station.nom,
                latitude:station.latitude,
                longitude:station.longitude,
                accessiblite: station.accessiblite
              }
            return s;
            });
        }),
      );
    }
    
    fetchStation(id):Observable<any> {
        const params = new HttpParams({
            fromObject: {
                id: id
              }
        });
        return this.http.get<any>(this.urlGinko+"/DR/getDetailsArret.do", {params: params}).pipe(
          map(response => {
            const data = response.objets;
            const s:Station = {
                id:data.id,
                name:data.nom,
                latitude:data.latitude,
                longitude:data.longitude,
                accessiblite: data.accessiblite
            }
            return s;
          }),
          catchError(this.handleError('fetchStation', []))
        );
      }

  fetchStationsProche(latitude, longitude):Observable<any> {
    const params = new HttpParams({
        fromObject: {
            latitude: latitude,
            longitude: longitude,
          }
    });
    return this.http.get<any>(this.urlGinko+"/DR/getArretsProches.do", {params: params})
    .pipe(
        map(response => {
          return response.objets.map(station  => {
            const s: Station = {
                id:station.id,
                name:station.nom,
                latitude:station.latitude,
                longitude:station.longitude,
                latLong:station.latitude+";"+station.longitude,
                accessiblite: station.accessiblite
              }
        return s;
        });
    }),
    catchError(this.handleError('fetchStationsProche', []))
    );
}  

  fetchListeTemps(searchListeTemps:SearchListeTemps):Observable<StationAttente[]> {
    let noms = "";
    if(searchListeTemps.listeNoms){
        searchListeTemps.listeNoms.forEach((nom, index, array) => {
            if (index === array.length - 1){ 
                noms+=nom;      
            }else{
                noms+=nom+"~";
            }  
        });
    }
    let lignes = "";
    if(searchListeTemps.listeIdLignes){
        searchListeTemps.listeIdLignes.forEach((ligne,index, array) => {
            if (index === array.length - 1){ 
                lignes+=ligne;      
            }else{
                lignes+=ligne+"~";
            } 
        });
    }
    let sensAller = "";
    if(searchListeTemps.listeSensAller){
        searchListeTemps.listeSensAller.forEach((sens, index, array) => {
            if (index === array.length - 1){ 
                sensAller+=sens.toString();      
            }else{
                sensAller+=sens.toString()+"~";
            } 
        }); 
    }

    const params = new HttpParams({
        fromObject: {
            listeNoms: noms,
            listeIdLignes: lignes,
            listeSensAller: sensAller,
            nb: searchListeTemps.nb.toString(),
            preserverOrdre: searchListeTemps.preserverOrdre.toString(),
          }
    });
    return this.http
        .get<any>(this.urlGinko+"/TR/getListeTemps.do", {params: params})
        .pipe(
            map(response => {
            var data = response.objets;
            let stationAttentes: StationAttente[] = [];
            if(data && data.length > 0){
                data.forEach(d => {
                    stationAttentes.push(new StationAttente(d.nomExact, d.listeTemps));
                });
            }
            return stationAttentes;
        }),
        catchError(this.handleError('fetchListeTemps', []))
    );
  }

  fetchTempsLieu(nameStation:string) {
    const params = new HttpParams({
        fromObject: {
            nom: nameStation,
            nb: '2',
          }
    });
    return this.http
        .get<any>(this.urlGinko+"/TR/getTempsLieu.do", { params: params })
        .pipe(
            map(response => {
            var data = response.objets;
            return new StationAttente(data.nomExact, data.listeTemps);
            })
        );
  }

  fetchInfosTrafic() {
    return this.http
        .get<any>(this.urlGinko+"/TR/getInfosTrafic.do")
        .pipe(
            map(response => {
            var data = response.objets;
            return new InfosTrafic(data);
            })
        );
  }

  fetchTitreTransport() {
    let url =  this.urlGinko+"/Tarifs/get.do";
    return this.http
        .get<any>(url)
        .pipe(
            map(response => {
                var data = response.objets;
            return data;
        })
    )
  }

  fetchLines() {
    let url =  this.urlGinko+"/DR/getLignes.do";
    return this.http
        .get<any>(url)
        .pipe(
            map(response => {
              return response.objets.map(line  => {
                const l: Line = {
                    id:line.id,
                    numLignePublic:  line.numLignePublic,
                    libellePublic: line.libellePublic,
                    modeTransport: line.modeTransport,
                    couleurFond:line.couleurFond, 
                    couleurTexte: line.couleurTexte,
                    variantes:line.variantes,
                    periurbain:line.periurbain,
                    scolaire:line.scolaire,
                  }
            return l;
            });
        }),
        catchError(this.handleError('fetchLines', []))
        );
  }

  fetchVariantes(idLigne:string, idVariante:string) {
    const params = new HttpParams({
        fromObject: {
            idLigne: idLigne,
            idVariante: idVariante,
          }
    });
    let url =  this.urlGinko+"/DR/getDetailsVariante.do";
    return this.http.get<any>(url, {params: params})
        .pipe(
            map(response => {
              return response.objets.map(station  => {
                const s: Station = {
                    id:station.id,
                    name:station.nom,
                    latitude:station.latitude,
                    longitude:station.longitude,
                    latLong:station.latitude+";"+station.longitude,
                    accessiblite: station.accessiblite
                  }
            return s;
            });
        }),
        catchError(this.handleError('fetchLines', []))
        );
  }
    

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
