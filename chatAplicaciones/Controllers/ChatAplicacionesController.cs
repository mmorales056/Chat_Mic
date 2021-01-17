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
        private int estadoPermisos;
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
                if(estadoPermisos == 0)
                {
                    var response = await _context.Chat_tblComentarioCab.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'Insert', @IdAplicacion = {datos.IdAplicacion}, @Usuario = {datos.IdUsuario} , @Comentario = '{datos.Comentario}'").ToListAsync();

                    foreach (var documento in datos.Documentos)
                    {
                        await _context.Chat_tblDocumento.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'InsertDocuments', @IdRowCab = {response[0].IdRows}, @Documento = '{documento}' ").ToListAsync();
                    }
                    foreach (var user in datos.Usuarios)
                    {
                        await _context.Usuarios.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'AddEmails', @IdRowCab={Convert.ToInt32(response[0].IdRows)}, @Usuario={user} ").ToListAsync();
                    }
                    return Ok(response);
                }
                else
                {
                    return NoContent();
                }                
            } catch (Exception ex)
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
                if(bodyComent.Permisos == 1)
                {
                    var response = await _context.Chat_TblComentarioLins.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'InsertRespuesta'," +
                    $"@IdRowCab={bodyComent.IdRowCabecera},  " +
                    $"@Usuario={bodyComent.IdUsuario}, " +
                    $"@Comentario = '{bodyComent.Comentario}'").ToListAsync();
                    return Ok(response);
                }else
                {
                    return Ok(2);
                }                
            } catch (Exception ex)
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


                var IdRowCab = await _context.Exists.FromSqlRaw($"[dbo].[sp_ChatAplicacion] @Accion= 'ConsultarDocuments'").ToListAsync();   
                if(IdRowCab.Count > 0)
                {
                    var estado = await _context.Permission.FromSqlRaw($"[dbo].[sp_ChatAplicacion] @Accion= 'validatePermission', @Usuario={coment.IdUsuario}, @IdAplicacion={coment.IdAplicacion}, @IdRowCab={IdRowCab[0].IdRow}").ToListAsync();

                    estadoPermisos = estado[0].estado;

                    if (estadoPermisos == 1)
                    {
                        foreach (var documento in coment.Documento)
                        {
                            var Addtemp = await _context.Document.FromSqlRaw($"[dbo].[sp_ChatAplicacion] @Accion= 'DocumentsTemp',@Documento='{documento}' ").ToListAsync();
                        }

                        response = await _context.ComentsDTO.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'ObtenerDatos', @IdAplicacion= {coment.IdAplicacion} , @Usuario={coment.IdUsuario},  @IdRowCab={IdRowCab[0].IdRow}").ToListAsync();
                        return Ok(response);
                    }
                    else if(estadoPermisos == 2)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        return NoContent();
                    }
                }
                else
                {
                    return NoContent();
                }
 
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            
        }



        [HttpPost("[action]")]
        public async Task<ActionResult> GetEmails([FromBody] Emails email)
        {
            var response = new List<EmailsDto>();
            try
            {
                response = await _context.Emails.FromSqlRaw($"exec [dbo].[sp_ChatAplicacion] @Accion= 'GetEmails', @IdAplicacion= {email.IdAplicacion}").ToListAsync();

            } catch (Exception e)
            {
                return NoContent();
            }
            return Ok(response);
        }


        //public async Task<ActionResult> ValidatePermission([FromBody] UserPermission permission)
        //{
        //    try
        //    {

        //        return null;

        //    }catch(Exception ex)
        //    {
        //        return NoContent();
        //    }
        //}
    }
}
