import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comentario } from '../Interfaces/Coment';
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
  comentarios: Comentario[] = [];
  coloresUsuarios: { IdUsuario: number, Color: string }[] = [];
  mensaje: string = "";
  UsersEmail: any;
  IdRowCabecera: number;
  estado: any;
  ComentariosArray: Comentario[] = [];
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
    debugger
    service.GetComentarios(object).subscribe((data: Comentario[]) => {
      debugger
      console.log(data);
      if (data != null) {
        data.forEach(element => {
          let newObj = new Comentario();
          newObj.idRows = element.idRows;
          newObj.idRowsCabecera = element.idRowsCabecera;
          newObj.fechaCreacion = element.fechaCreacion;
          newObj.aplicacion = element.aplicacion;
          newObj.usuario = element.usuario;
          newObj.idUsuario = element.idUsuario;
          newObj.comentario = element.comentario;
          newObj.fechaComentario = element.fechaComentario;
          this.comentarios.push(newObj);
          if (this.IdRowCabecera == undefined) {
            this.IdRowCabecera = element.idRowsCabecera;
          }
          if (this.coloresUsuarios.some(color => color.IdUsuario === element.idUsuario)) {
            console.log('hola');
            return
          } else {
            this.coloresUsuarios.push({ IdUsuario: element.idUsuario, Color: this.getRandomColor() })
          }
        });
      }
      console.log("Cab", this.IdRowCabecera);
      console.log("coment ", this.comentarios);
    }, error => console.log(error));
    console.log('colores', this.coloresUsuarios);
  }

  ngOnInit() {
    this.service.retrieveMappedObject()
      .subscribe((receivedObj: Comentario) => {
        console.log("init ", receivedObj)
        this.addToInbox(receivedObj);
      });  // calls the service method to get the new messages sent

  }

  addToInbox(obj: Comentario) {
    let newObj = new Comentario();
    newObj.idRows = obj.idRows;
    newObj.idRowsCabecera = obj.idRowsCabecera;
    newObj.aplicacion = obj.aplicacion;
    newObj.fechaCreacion = obj.fechaCreacion;
    newObj.usuario = obj.usuario;
    newObj.idUsuario = obj.idUsuario;
    newObj.email = obj.email;
    newObj.comentario = obj.comentario;
    newObj.fechaComentario = obj.fechaComentario;
    this.comentarios.push(newObj);
    console.log('observable: ', newObj);
  }

  enviar_mensaje() {    
    if (this.comentarios.length == 0) {
      let usuarios = $('#userlist').val().split(',')
      let IdUsuarios = []
      for (let index = 0; index < usuarios.length; index++) {
        IdUsuarios.push(parseInt(usuarios[index].replace(/[^0-9]/g, "")))
      }
      IdUsuarios.push(this.IdUsuario);

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
        this.service.GetComentarios(obj).subscribe((data: Comentario[]) => {
          if(data != null){
            data.forEach(element => {
              let newObj = new Comentario();
              newObj.idRows = element.idRows;
              newObj.idRowsCabecera = element.idRowsCabecera;
              newObj.fechaCreacion = element.fechaCreacion;
              newObj.aplicacion = element.aplicacion;
              newObj.usuario = element.usuario;
              newObj.idUsuario = element.idUsuario;
              newObj.comentario = element.comentario;
              newObj.fechaComentario = element.fechaComentario;              
              this.comentarios.push(newObj);
              if (this.IdRowCabecera == undefined) {
                this.IdRowCabecera = element.idRowsCabecera;
              }
              if (this.coloresUsuarios.some(color => color.IdUsuario === element.idUsuario)) {
                console.log('hola');
                return
              } else {
                this.coloresUsuarios.push({ IdUsuario: element.idUsuario, Color: this.getRandomColor() })
              } 
            });
            debugger
            console.log('hola', {IdRowCabecera: this.IdRowCabecera,users: IdUsuarios});
            this.service.EnviarCorreos({IdRowCabecera: this.IdRowCabecera,users: IdUsuarios}).subscribe(e=>{
              console.log(e);
            });         
          }
          console.log(this.IdRowCabecera)
          
        }, error => console.log(error));
      }, error => console.log(error))

      this.mensaje = "";
      var x =document.getElementById("userlist");
      x.innerHTML = '';
    }
    else {

      let obj = {
        IdRowCabecera: this.IdRowCabecera,
        IdUsuario: this.IdUsuario,
        Comentario: this.mensaje,
        Permisos: 1
      }
      this.service.Responder(obj);
      this.mensaje = ''      
    }

  }


  GetEmails() {
    this.http.post("http://miclocal.com.co:9330/api/ChatAplicaciones/GetEmails", { IdAplicacion: this.IdAplicacion }).subscribe(data => {
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

  getRandomColor() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  setColor(index){
    let usuario = this.comentarios[index].idUsuario;
    let col='';
    this.coloresUsuarios.filter(color=>{
      if (color.IdUsuario == usuario){
        col= color.Color;
      }
    })
    console.log(col);
    return col
  }


}
