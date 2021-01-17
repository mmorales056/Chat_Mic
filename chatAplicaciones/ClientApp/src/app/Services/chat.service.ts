import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url: string= ''
  constructor(private http: HttpClient) { 
    this.url= environment.url;
  }

  GetComentarios(body:any){
    return this.http.post(this.url + 'GetComments',body);
  }


  CrearCabeceraComentario(body:any){
    return this.http.post(this.url,body);
  }

  ResponderComentario(body:any){
    return this.http.post(this.url + "PostResponder",body);
  }

  ObtenerCorreos(body:any){
    return this.http.post(this.url + "GetEmails" , body);
  }


}
