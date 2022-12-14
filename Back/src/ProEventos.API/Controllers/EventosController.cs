using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application;
using ProEventos.Application.Dtos;
using ProEventos.Domain;


namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {            
           
        private readonly IEventoService _eventoService;
        private readonly IWebHostEnvironment _hostEnvironment;
                      
        public EventosController(IEventoService eventoService, IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
            _eventoService = eventoService;
        }
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if(eventos == null) return NoContent();
                                
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            //return _evento.Where(evento => evento.EventoId == id && evento.Local == local );
            //return _context.Eventos.FirstOrDefault(evento => evento.Id == id);
            //return NotFound("Eventos por tema não encontrado.");
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id,true);
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar evento Erro: {ex.Message}");
            }            
        }

        [HttpGet("{tema}/tema")]
        public async Task<IActionResult> GetByTema(string tema)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosByTemaAsync(tema,true);
                if(eventos == null) return NoContent();

                return Ok(eventos);
            }
            catch (Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos Erro: {ex.Message}");
            }            
        }
        
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            //return "Exemplo de POST por Fernando José Helfenstein";
            //return BadRequest("Erro ao tentar adicionar o evento.");
            try
            {
                var evento = await _eventoService.AddEventos(model);
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch (Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar adicionar eventos Erro: {ex.Message}");
            }              
        }

        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(eventoId,true);
                if(evento == null) return NoContent();

                var file = Request.Form.Files[0];
                if(file.Length > 0 ) {

                    DeleteImage(evento.ImagemURL);
                    evento.ImagemURL = await SaveImage(file);
                }

                var eventoRetorno = await _eventoService.UpdateEvento(eventoId,evento);
                return Ok(eventoRetorno);
            }
            catch (Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar realizar upload de imagem Erro: {ex.Message}");
            }              
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(id,model);
                if(evento == null) return NoContent();

                return Ok(evento);
            }
            catch (Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar eventos Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            //return $"Exemplo de DELETE por Fernando José Helfenstein id= {id}";
            try
            {

                var evento = await _eventoService.GetEventoByIdAsync(id,true);
                if(evento == null) return NoContent();
                
                if (await _eventoService.DeleteEvento(id))
                {
                    DeleteImage(evento.ImagemURL);
                    return Ok( new {message = "Deletado."} ); 
                } 
                else
                {
                    throw new Exception("Ocorreu um problema não específico ao tentar deletar o Evento");
                }                                        
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar eliminar evento Erro: {ex.Message}");
            }               
            
        }

        // Quando utllizar o verbo NonAcxtion dentro de um controller poderá ser criado métodos porém  não será acessado como sendo um endpoint
        [NonAction]
        public void DeleteImage(string imageName) 
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"resources/images",imageName);
            if(System.IO.File.Exists(imagePath)) {
                System.IO.File.Delete(imagePath);
            }
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
                                               .Take(10)
                                               .ToArray()                        
            ).Replace(' ','-') ;

            imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";

            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"resources/images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }
    }
}
