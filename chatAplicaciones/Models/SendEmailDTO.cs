using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatAplicaciones.Models
{
    [Keyless]
    public class SendEmailDTO
    {
        public string email { get; set; }
        public bool estado { get; set; }
        public int app { get; set; }
    }
}
