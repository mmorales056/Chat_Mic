using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    public class EmailsDto
    {
        [Key]
        public string Email { get; set; }
        public string Nombre { get; set; }
    }
}
