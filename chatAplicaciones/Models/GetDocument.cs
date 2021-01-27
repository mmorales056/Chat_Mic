using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    [Keyless]
    public class GetDocument
    {
        public string Documento { get; set; }
    }
}
