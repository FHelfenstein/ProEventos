using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {            
        // definido variável pública do evento e inserido o array que estava dentro do método get para esta variável
        public IEnumerable<Evento> _evento = new Evento[] {
            new Evento(){
                EventoId = 1,
                Tema = "Angular 12 e .NET 5",
                Local = "Belo Horizonte",
                DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                QtdPessoas = 250,
                Lote = "1º Lote",
                ImagemURL = "foto.png"
            },
            new Evento(){
                EventoId = 2,
                Tema = "Curiosidades do Angular",
                Local = "São Paulo",
                DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy"),
                QtdPessoas = 200,
                Lote = "2º Lote",
                ImagemURL = "foto1.png"
            },
            new Evento(){
                EventoId = 3,
                Tema = "Semana Farroupilha",
                Local = "Balneário Camboriú",
                DataEvento = DateTime.Now.AddDays(15).ToString("dd/MM/yyyy"),
                QtdPessoas = 1300,
                Lote = "3º Lote",
                ImagemURL = "foto3.png"
            }                                       
        }; 
       
        public EventoController()
        {
        }
        
        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }

        [HttpGet("{id},{local}")]
        public IEnumerable<Evento> GetById(int id, string local)
        {
            return _evento.Where(evento => evento.EventoId == id && evento.Local == local );
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
