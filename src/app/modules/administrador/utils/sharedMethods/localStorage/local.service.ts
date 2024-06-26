import {Injectable} from '@angular/core';
import *  as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }
  key = "MegustaLaSeguridad123"

  //funciones para encriptar y desencriptar datos del local storage

  //encriptar
  private encrypt(txt : string) : string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }
  //desencriptar
  private decrypt(txtToDecrypt : string){
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }
  public getUserRole() : string | null{
    return sessionStorage.getItem("rol");
  }
  public getNombreApellidoUsuario() : string | null{
    return sessionStorage.getItem("nombre") + " " + sessionStorage.getItem("apellido");
  }
  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    return this.decrypt(data);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
