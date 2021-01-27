using System;

namespace Reglas
{
    /// <summary>
    /// Clase para el envío de los Email (Notificaciones).
    /// </summary>
    public class Mail
    {
        #region variables/Instancias

        //Configuración del Envío de los Email
        System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
        System.Net.Mail.MailMessage email = new System.Net.Mail.MailMessage();

        #endregion


        /// <summary>
        /// Enviar Email de acuerdo al formato a envíar.
        /// </summary>
        /// <param name="EmailPara">Dirección de Correo electrónico de salida.</param>
        /// <param name="Asunto">Asunto del Mensaje</param>
        /// <param name="BodyMsg">Contenido del mensaje</param>
        /// <param name="BodyHtml">Determina si es cuerpo del mensaje es en HTML.</param>
        /// <returns></returns>
        public bool EnviarMail(string EmailPara, string Asunto, string BodyMsg, bool BodyHtml = true)
        {
            bool Enviado = false;
            try
            {
                //Obtener la información de la cuenta que envía los email.
               
                //Configuración SMTP
                smtp.Host = "smtp.office365.com";
                smtp.Port = 587;
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;

                string UsrEmail = "Departamento de Devoluciones <notificaciones@moviesshop.co>";
                string UsrConfigEmail = "notificaciones@moviesshop.co";
                string PassEmail = "Colombia2020*";
                smtp.Credentials = new System.Net.NetworkCredential(UsrConfigEmail, PassEmail);
                //Configuración del Email
                email.To.Clear();
                email.To.Add(new System.Net.Mail.MailAddress(EmailPara));
                email.From = new System.Net.Mail.MailAddress(UsrEmail);
                email.Subject = Asunto;
                email.Body = BodyMsg;
                email.IsBodyHtml = BodyHtml;
                email.Priority = System.Net.Mail.MailPriority.Normal;
                //ENVIO DEL EMAIL
                smtp.Send(email);
                Enviado = true;
            }
            catch (Exception ex)
            {
                string NombreClase = this.ToString();
                string DescripcionAccion = "Enviar Email.";
                string DetalleError = ex.Message;
                throw;
            }
            finally
            {
                //email.Dispose();
            }
            return Enviado;
        }

      

    }
}
