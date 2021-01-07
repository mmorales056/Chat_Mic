using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    public class ComentsDTO
    {
        [Key]
        public int IdRows { get; set; }
        public int IdRowsCabecera { get; set; }
        public string Aplicacion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public String Usuario {get;set;}
        public int IdUsuario { get; set; }
        public String Email { get; set; }
        public String Comentario { get; set; }
        public DateTime FechaComentario { get; set; }

    }
}
