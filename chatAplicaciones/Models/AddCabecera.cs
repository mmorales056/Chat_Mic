﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    public class AddCabecera
    {
        public int IdAplicacion { get; set; }
        public List<string> Documentos { get; set; }
        public List<int> Usuarios { get; set; }
        public int IdUsuario { get;  set; }
        public string Comentario { get; set; }


    }

    public class Documentos
    {
        [Key]
        public string documento  { get; set; }
    }

    public class Usuarios
    {
        [Key]
        public int IdRows { get; set; }
        public int IdRowsCab { get; set; }
        public int IdUsuario { get; set; }
    }

    public class DocumentsExist
    {

        [Key]
        public int IdRow { get; set; }
    }

}
