using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {            
           
        private readonly IEventoService _eventoService;
                      
        public EventosController(IEventoService eventoService)
        {
            _eventoService = eventoService;
        }
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if(eventos == null) return NotFound("Nenhum evento encontrado.");

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
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id,true);
                if(evento == null) return NotFound("Evento por Id não encontrado.");

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
                if(eventos == null) return NotFound("Eventos por tema não encontrado.");

                return Ok(eventos);
            }
            catch (Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos Erro: {ex.Message}");
            }            
        }
        
        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            //return "Exemplo de POST por Fernando José Helfenstein";
            try
            {
                var evento = await _eventoService.AddEventos(model);
                if(evento == null) return BadRequest("Erro ao tentar adicionar o evento.");

                return Ok(evento);
            }
            catch (Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar adicionar eventos Erro: {ex.Message}");
            }              
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Evento model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(id,model);
                if(evento == null) return BadRequest("Erro ao tentar atualizar o evento.");

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
                return await _eventoService.DeleteEvento(id) ? Ok("Deletado.") : BadRequest("Evento não deletado.");                
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar eliminar evento Erro: {ex.Message}");
            }               
            
        }

    }
}
