using chatAplicaciones.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Hubs
{
    public class ChatHub: Hub
    {
        public Task EnviarRespuesta(Chat_tblComentarioLin coment)               // Two parameters accepted
        {
            return Clients.All.SendAsync("enviarRespuesta", 
                coment.IdRows,
                coment.IdRowsCabecera,
                coment.Aplicacion, 
                coment.FechaCreacion,
                coment.Usuario,
                coment.IdUsuario,
                coment.Email,
                coment.Comentario,
                coment.FechaComentario);    // Note this 'ReceiveOne' 
        }
    }
}
