using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    public class UserPermission
    {
        public int IdAplicacion { get; set; }
        public List<String> Documents { get; set; }
    }
}
