import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {InsumoProducto, InsumoProductoResponse} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class InsumosPorProductoService {
  //observabla (ayuda a saber cuando refrescar el componente)
  private _refreshNeeded = new Subject<void>();

  get refreshNeeded(){
    return this._refreshNeeded
  }

  //url api
  private apiUrl = 'http://localhost:8080/api/v1/insumo-por-producto';
  constructor(private http : HttpClient) { }

  getInsumosPorProducto(id : number) : Observable<any>{
    return this.http.get<InsumoProductoResponse>(`${this.apiUrl}/producto/${id}`)
  }

  //actualizar ipp
  updateIpp(ipp : InsumoProducto){
    const id = ipp.id;
    const insumoId = ipp.insumo.id;
    const productoId = ipp.producto.id
    console.log("desde el service: ", ipp)
    // Configura un encabezado personalizado con el ID
    const headers = new HttpHeaders().set('Id', id.toString()).set('insumoId', ipp.insumo.id.toString())
      .set('productoId', ipp.producto.id.toString());

    return this.http.put(`${this.apiUrl}/${id}/${insumoId}/${productoId}`, ipp, {headers});
  }

  //eliminar ipp
  deleteIpp(id :number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(
          () =>{
            this._refreshNeeded.next()
          }
        )
      )
  }

  //crear ipp
  createIpp(insumosPorProducto : InsumoProducto): Observable<any>{

    let params : HttpParams = new HttpParams()
      .set('idInsumo', insumosPorProducto.insumo.id)
      .set('idProducto', insumosPorProducto.producto.id);

    return this.http.post(this.apiUrl, insumosPorProducto, {params})
      .pipe(
        tap(
          () => {
            this._refreshNeeded.next();
          }
        )
      );
  }
}
