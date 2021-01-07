using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using chatAplicaciones.Context;
using chatAplicaciones.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace chatAplicaciones.Controllers
{
    [Route("api/[controller]")]
    public class ChatAplicacionesController : Controller
    {
        private readonly AppDbContext _context;
        public ChatAplicacionesController(AppDbContext context)
        {
            _context = context;
        }
       
        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] AddCabecera datos)
        {
            try
            {
                var response = await _context.Chat_tblComentarioCab.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'Insert', @IdAplicacion = {datos.IdAplicacion}, @Usuario = {datos.IdUsuario} , @Comentario = '{datos.Comentario}'").ToListAsync();

                foreach (var documento in datos.Documentos)
                {
                    await _context.Chat_tblDocumento.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'InsertDocuments', @IdRowCab = {response[0].IdRows}, @Documento = '{documento}' ").ToListAsync();
                }

                return Ok(
                    response
                    );
            }catch(Exception ex)
            {
                return NoContent();
            }
        }

        // POST api/responder

        
        [HttpPost("[action]")]
        public async Task<ActionResult> PostResponder([FromBody] AddBodyComent bodyComent)
        {
            try
            {
                var response = await _context.Chat_TblComentarioLins.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'InsertRespuesta'," +
                    $"@IdRowCab={bodyComent.IdRowCabecera},  " +
                    $"@Usuario={bodyComent.IdUsuario}, " +
                    $"@Comentario = '{bodyComent.Comentario}'").ToListAsync();
                return Ok(response);

            }catch (Exception ex)
            {
                return NoContent();
            }
        }


        [HttpPost("[action]")]
        public async Task<ActionResult> GetComments([FromBody] Coments coment)
        {
            var response = new List<ComentsDTO>();
            try
            {
                foreach (var documento in coment.Documento)
                {
                    var Addtemp = await _context.Document.FromSqlRaw($"[dbo].[sp_ChatAplicacion] @Accion= 'DocumentsTemp',@Documento='{documento}' ").ToListAsync();
                }

               response = await _context.ComentsDTO.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'ObtenerDatos', @IdAplicacion= {coment.IdAplicacion}").ToListAsync();
            }
            catch (Exception ex)
            {
               return BadRequest(ex);
            }
            return Ok(response);
        }



        [HttpPost("[action]")]
        public async Task<ActionResult> GetEmails([FromBody] Emails email)
        {
            var response = new List<EmailsDto>();
            try
            {
                response = await _context.Emails.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'GetEmails', @IdAplicacion= {email.IdAplicacion}").ToListAsync();

            }catch(Exception e)
            {
                return NoContent();
            }
            return Ok(response);
        }
        

        
    }
}
