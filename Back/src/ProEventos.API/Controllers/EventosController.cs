using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Data;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {            
           
        public readonly DataContext _context;
                      
        public EventosController(DataContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _context.Eventos;
        }

        [HttpGet("{id}")]
        public Evento GetById(int id)
        {
            //return _evento.Where(evento => evento.EventoId == id && evento.Local == local );
            return _context.Eventos.FirstOrDefault(evento => evento.EventoId == id);
        }
        
        [HttpPost]
        public string Post()
        {
            return "Exemplo de POST por Fernando José Helfenstein";
        }

        [HttpPut("{id}")]
        public string Put(int id)
        {
            return $"Exemplo de PUT por Fernando José Helfenstein id= {id}";
        }

        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            return $"Exemplo de DELETE por Fernando José Helfenstein id= {id}";
            
        }

    }
}
