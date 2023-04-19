using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContatosController : ControllerBase
    {
        private readonly IContatoService _contatoService;
                
        public ContatosController(IContatoService contatoService)
        {
            _contatoService = contatoService;
        }      

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string nome) 
        {
            try
            {
                var contatos = await _contatoService.GetAllContatosAsync(nome);
                if(contatos == null) return NoContent();

                return Ok(contatos);
                
            }
            catch (System.Exception ex)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar contatos Erro: ${ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContatoById(int id ) 
        {
            try
            {
                var contato = await _contatoService.GetContatoByIdAsync(id);
                if(contato == null) return NoContent();

                return Ok(contato); 
                
            }
            catch (System.Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar contato Erro: ${ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(ContatoDto model) 
        {
            try
            {
                var contato = await _contatoService.AddContatos(model);
                if(contato == null) return NoContent();

                return Ok(contato);
                
            }
            catch (System.Exception ex)
            {               
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar adicionar contatos Erro: ${ex.Message}");
            }            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ContatoDto model)
        {
            try
            {
                var contato = await _contatoService.UpdateContato(id, model);
                if(contato == null) return NoContent();

                return Ok(contato);
                
            }
            catch (System.Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar atualizar contato Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
              var contato = await _contatoService.GetContatoByIdAsync(id);
              if(contato == null) return NoContent();

              if (await _contatoService.DeleteContato(id))
              {
                return Ok( new {message = $"Deletado por {User.GetUserName()}",
                                date    = DateTime.Now.ToString()});
              }
              else
              {
                throw new Exception("Ocorreu um problema não específico ao tentar deletar o Contato");
              }
            }
            catch (System.Exception ex)
            {              
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar eliminar contato Erro: {ex.Message}");
            }
        }

    }
}