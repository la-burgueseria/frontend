import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {Egreso} from "../interfaces/egreso";
import {EnvService} from "../utils/sharedMethods/env/env.service";

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  constructor(private http : HttpClient, private env : EnvService) { }

  private _refreshNeeded = new Subject<void>();

  get refreshNeeded(){
    return this._refreshNeeded
  }

  private apiUrl = `${this.env.getUrl()}/egreso`;

  //Crear egreso
  crearEgreso(egreso: Egreso): Observable<any> {
    const formData = new FormData();

    formData.append('descripcion', egreso.descripcion);
    formData.append('fecha', '');
    formData.append('total', egreso.total.toString());
    formData.append('categoria', egreso.categoria);
    formData.append('deduccionDesde', egreso.deduccionDesde);
    formData.append('soporte', egreso.soporte);

    return this.http.post(this.apiUrl, formData)
      .pipe(
        tap(
          () => {
            this._refreshNeeded.next();
          }
        )
      );
  }


  //obtener egresos paginados filtrados por fecha
  getEgresoPageableByFecha(fechaInicio : string, fechaFin : string | null,
                           numeroPagina: number, tamanoPagina: number,
                           order : string, asc : boolean) : Observable<any>{
    let params : HttpParams = new HttpParams()
      .set('page', numeroPagina.toString())
      .set('size', tamanoPagina.toString())
      .set('order', order)
      .set('asc', asc);

    let headers: HttpHeaders = new HttpHeaders()
      .set('fechaInicio', new Date(fechaInicio).toISOString());

    if (fechaFin != null) {
      headers = headers.set('fechaFin', new Date(fechaFin).toISOString());
    }

    return this.http.get(`${this.apiUrl}s-page/fecha`, {headers, params})
  }

  //eliminar egreso
  deleteEgreso(id : number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(
          () => {
            this._refreshNeeded.next();
          }
        )
      )
  }


  //obtener lista de egresos entre dos fechas
  getListEgresoByFecha(fechaInicio : string, fechaFin : string | null) : Observable<any>{
    let headers: HttpHeaders = new HttpHeaders()
      .set('fechaInicio', new Date(fechaInicio).toISOString());

    if (fechaFin != null) {
      headers = headers.set('fechaFin', new Date(fechaFin).toISOString());
    }

    return this.http.get(`${this.apiUrl}s/fechas-horario-laboral`, {headers})
  }

  //obtener resumen de egresos
  getResumen() : Observable<any>{
    return this.http.get(`${this.apiUrl}s/resumen`)
  }
}
