import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {ProductoCuenta} from "../interfaces/productosCuenta";
import {EnvService} from "../utils/sharedMethods/env/env.service";

@Injectable({
  providedIn: 'root'
})
export class ProductosCuentaService {

  private _refreshNeeded = new Subject<void>();
  private apiUrl = `${this.env.getUrl()}/cuenta-productos`;
  get refreshNeeded(){
    return this._refreshNeeded
  }
  constructor(private http : HttpClient, private env : EnvService) { }

  //CREAR PRODUCTO CUENTA
  public crearProductoCuenta(productoCuenta : ProductoCuenta) : Observable<any>{
    return this.http.post(this.apiUrl, productoCuenta)
      .pipe(
        tap(
          () => {
            this._refreshNeeded.next();
          }
        )
      );
  }
  //OBTENER TODOS LOS PRODUCTOS DE UNA CUENTA X
  public getProductoCuentaByCuentaId(cuentaId : number) : Observable<any>{
    return this.http.get(`${this.apiUrl}/cuenta/${cuentaId}`);
  }

  //ACTUALIZAR PRODUCTO CUENTA
    public actualizarProductoCuenta(productoCuenta : ProductoCuenta) : Observable<any>{
      const id : number = productoCuenta.id;
      return this.http.put(`${this.apiUrl}/${id}`, productoCuenta)
        .pipe(
          tap(
            () => {
              this._refreshNeeded.next();
            }
          )
        );
    }

    public eliminarProductoCuenta(id:number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(
          () => {
            this._refreshNeeded.next();
          }
        )
      )
    }
}
