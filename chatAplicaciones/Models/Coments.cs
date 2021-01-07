using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    public class Coments
    {
        public List<string> Documento { get; set; }
        public int IdAplicacion { get; set; }
        public int IdUsuario { get; set; }
    }
}
