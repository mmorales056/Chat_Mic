import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  IdAplicacion: any;  
  IdUsuario: any;
  documentos: string[]=[];
  comentarios:any;
  mensaje: string="";
  UsersEmail: any;
  

  // documentos = {"": []};
  constructor(private activateRoute: ActivatedRoute, private http: HttpClient) {
    this.documentos.push(this.activateRoute.snapshot.params.doc1)
    if(this.activateRoute.snapshot.params.doc2 != undefined){
      this.documentos.push(this.activateRoute.snapshot.params.doc2)
    }
    if(this.activateRoute.snapshot.params.doc3 != undefined){
      this.documentos.push(this.activateRoute.snapshot.params.doc3)
    }
    if(this.activateRoute.snapshot.params.doc4 != undefined){
      this.documentos.push(this.activateRoute.snapshot.params.doc4)
    }
    this.IdAplicacion=parseInt(this.activateRoute.snapshot.params.IdAplicacion);
    this.IdUsuario =parseInt(this.activateRoute.snapshot.params.Usuario);    
    this.GetEmails();

    let object = {
      Documento:this.documentos,
      IdAplicacion:parseInt(this.IdAplicacion),
      IdUsuario: this.IdUsuario
    }

     this.http.post("https://localhost:44389/api/ChatAplicaciones/GetComments",object).subscribe(obj=>{
        this.comentarios=obj;        
        
    },error=>console.log(error))
  }

  ngOnInit() {    
    
  }

  enviar_mensaje(){
    if(Object.entries(this.comentarios).length == 0){
      let usuarios = $('#userlist').val().split(',')      
      let IdUsuarios = []
      for (let index = 0; index < usuarios.length; index++) {
        IdUsuarios.push(parseInt(usuarios[index].replace(/[^0-9]/g,"")))
      }            
      IdUsuarios.push(this.IdUsuario);      
      let object={
        IdAplicacion:this.IdAplicacion,
        Documentos: this.documentos,
        Usuarios: IdUsuarios,
        IdUsuario: this.IdUsuario,
        Comentario: this.mensaje
      }                  
      this.http.post("https://localhost:44389/api/ChatAplicaciones",object).subscribe(data=>{          
          let obj ={
            Documento:this.documentos,
            IdAplicacion: this.IdAplicacion,
            IdUsuario: this.IdUsuario
          }
          this.http.post("https://localhost:44389/api/ChatAplicaciones/GetComments",obj).subscribe(data=>{
              this.comentarios= data;
          },err=>console.log(err));
      },error=>{console.log(error);})
    }else{
      let obj={
        IdRowCabecera: parseInt(this.comentarios[0].idRowsCabecera),
        IdUsuario: this.IdUsuario,
        Comentario: this.mensaje
      }
      this.http.post("https://localhost:44389/api/ChatAplicaciones/PostResponder",obj).subscribe(data=>{
        console.log(data);
        let objComent={
            Documento:this.documentos,
            IdAplicacion: this.IdAplicacion,
            IdUsuario: this.IdUsuario
        };
        this.http.post("https://localhost:44389/api/ChatAplicaciones/GetComments",objComent).subscribe(data=>{
          this.comentarios=data;
        })

      },error=>console.log(error));      
    }
    this.mensaje="";
    $('#userlist').val('')


  }
  

  GetEmails(){
    this.http.post("https://localhost:44389/api/ChatAplicaciones/GetEmails",{IdAplicacion:this.IdAplicacion}).subscribe(data=>{
      this.UsersEmail= data;
      let emails= new Array()
      this.UsersEmail.forEach(element => {
        emails.push(element.nombre)
      });      
      $('input[name="users"]').amsifySuggestags({
        type :'bootstrap',
        suggestions: emails
      });      
    })
  }

  

}
