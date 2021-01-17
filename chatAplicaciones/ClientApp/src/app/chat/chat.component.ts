import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../Services/chat.service';
declare var $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  IdAplicacion: any;
  IdUsuario: any;
  documentos: string[] = [];
  comentarios: any;
  mensaje: string = "";
  UsersEmail: any;
  estado: any;

  // documentos = {"": []};
  constructor(private activateRoute: ActivatedRoute, private http: HttpClient, private service: ChatService) {
    //Llenamos el arreglo de documentos con el primer documento
    this.setParametersInput();
    //Obtenemos lo Mails para ingresarlos al select
    this.GetEmails();
    //Definmos el body para obtener los comentarios
    let object = {
      Documento: this.documentos,
      IdAplicacion: parseInt(this.IdAplicacion),
      IdUsuario: this.IdUsuario
    }
    //HAcemos la peticion a GetComments
    service.GetComentarios(object).subscribe(data => {      
      this.comentarios = data;
      console.log("coment ",this.comentarios);
    }, error => console.log(error));
  }

  ngOnInit() {

  }

  enviar_mensaje() {    
    if (this.comentarios==null) {
      let usuarios = $('#userlist').val().split(',')
      let IdUsuarios = []
      for (let index = 0; index < usuarios.length; index++) {
        IdUsuarios.push(parseInt(usuarios[index].replace(/[^0-9]/g, "")))
      }
      IdUsuarios.push(this.IdUsuario);
      debugger
      //body para la cabecera
      let object = {
        IdAplicacion: this.IdAplicacion,
        Documentos: this.documentos,
        Usuarios: IdUsuarios,
        IdUsuario: this.IdUsuario,
        Comentario: this.mensaje
      }
      //Body para obtener los comentarios
      let obj = {
        Documento: this.documentos,
        IdAplicacion: this.IdAplicacion,
        IdUsuario: this.IdUsuario
      }

      this.service.CrearCabeceraComentario(object).subscribe(() => {
        this.service.GetComentarios(obj).subscribe((data) => {
          this.comentarios = data;
        }, error => console.log(error));
      }, error => console.log(error))
      
      this.mensaje = "";
          $('#userlist').val('')
    }
    else {
      let objComent = {
        Documento: this.documentos,
        IdAplicacion: this.IdAplicacion,
        IdUsuario: this.IdUsuario
      };
      this.service.GetComentarios(objComent).subscribe(data=>{
        this.comentarios= data;
        let obj = {
          IdRowCabecera: parseInt(this.comentarios[0].idRowsCabecera),
          IdUsuario: this.IdUsuario,
          Comentario: this.mensaje,
          Permisos: 1
        }
        this.service.ResponderComentario(obj).subscribe(()=>{
          this.mensaje = "";
          $('#userlist').val('')
          this.service.GetComentarios(objComent).subscribe(data=>{
            this.comentarios= data;
          },error=>console.log(error));                
        }, error => console.log(error))  

      },error=>console.log(error)); 


      
          
    }
    
  }


  GetEmails() {
    this.http.post("https://localhost:44389/api/ChatAplicaciones/GetEmails", { IdAplicacion: this.IdAplicacion }).subscribe(data => {
      this.UsersEmail = data;
      let emails = new Array()
      this.UsersEmail.forEach(element => {
        emails.push(element.nombre)
      });
      $('input[name="users"]').amsifySuggestags({
        type: 'bootstrap',
        suggestions: emails
      });
    })
  }

  setParametersInput() {
    this.documentos.push(this.activateRoute.snapshot.params.doc1)
    //Preguntamos cuantos Documentos vienen en  la url y los adicionamos al vector
    if (this.activateRoute.snapshot.params.doc2 != undefined) {
      this.documentos.push(this.activateRoute.snapshot.params.doc2)
    }
    if (this.activateRoute.snapshot.params.doc3 != undefined) {
      this.documentos.push(this.activateRoute.snapshot.params.doc3)
    }
    if (this.activateRoute.snapshot.params.doc4 != undefined) {
      this.documentos.push(this.activateRoute.snapshot.params.doc4)
    }
    //Obtenemos el IdAplicacion
    this.IdAplicacion = parseInt(this.activateRoute.snapshot.params.IdAplicacion);
    //Obtenemos el IdUSuario
    this.IdUsuario = parseInt(this.activateRoute.snapshot.params.Usuario);
  }


}
