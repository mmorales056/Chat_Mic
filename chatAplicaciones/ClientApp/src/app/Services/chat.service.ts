import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import * as signalR from "@microsoft/signalr"
import { Comentario } from '../Interfaces/Coment';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url: string= environment.url;
  private  connection: any = new signalR.HubConnectionBuilder().withUrl("http://miclocal.com.co:9330/chatsocket").configureLogging(signalR.LogLevel.Information).build();
  private receivedMessageObject: Comentario = new Comentario();
  private sharedObj = new Subject<Comentario>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on("enviarRespuesta", (idrows,idRowCabecera,aplicacion,fechaComentario,usuario,idusuario,email,comentario) => { this.mapReceivedMessage(idrows,idRowCabecera,aplicacion,fechaComentario,usuario,idusuario,email,comentario); });
    this.start();    
  }


  public async start() {
    try {
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    } 
  }


  private mapReceivedMessage(idrows,idRowCabecera,aplicacion,fechaComentario,usuario,idusuario,email,comentario): void {
    debugger
    this.receivedMessageObject.idRows = idrows;
    this.receivedMessageObject.idRowsCabecera=idRowCabecera;
    this.receivedMessageObject.aplicacion=aplicacion;
    this.receivedMessageObject.usuario=usuario;
    this.receivedMessageObject.idUsuario=idusuario;
    this.receivedMessageObject.email=email;
    this.receivedMessageObject.comentario=comentario;
    this.receivedMessageObject.fechaComentario= fechaComentario;
    this.sharedObj.next(this.receivedMessageObject);
 }

  /* ****************************** Public Mehods **************************************** */

  // Calls the controller method
  public Responder(body: any) {
    this.http.post(this.url + "PostResponder", body)
      .subscribe(data => console.log('data: ', data));
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  public retrieveMappedObject(): Observable<Comentario> {
    return this.sharedObj.asObservable();
  }

/////////////////////////////////////////////////////////////////////
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

  EnviarCorreos(body){
    return this.http.post('http://miclocal.com.co:9330/api/ChatAplicaciones/EnviarEmail',body);
  }


}
