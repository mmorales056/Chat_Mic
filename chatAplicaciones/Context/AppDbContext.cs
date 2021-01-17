using chatAplicaciones.Models;
using Microsoft.EntityFrameworkCore;

namespace chatAplicaciones.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Chat_tblComentarioCab> Chat_tblComentarioCab { get; set; }
        public DbSet<Chat_tblDocumento> Chat_tblDocumento { get; set; }
        public DbSet<Chat_tblComentarioLin> Chat_TblComentarioLins { get; set; }
        public DbSet<ComentsDTO> ComentsDTO { get; set; }
        public DbSet<Documentos> Document { get; set; } 
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<EmailsDto> Emails { get; set; }
        public DbSet<Permission> Permission { get; set; }
        public DbSet<DocumentsExist> Exists { get; set; }

    }
    
}
