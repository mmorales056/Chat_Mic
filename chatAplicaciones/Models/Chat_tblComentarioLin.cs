using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    public class Chat_tblComentarioLin
    {
        [Key]
        public int IdRows { get; set; }

        public string Usuario { get; set; }
        public string Comentario { get; set; }
        public DateTime FechaComentario { get; set; }
    }
}
