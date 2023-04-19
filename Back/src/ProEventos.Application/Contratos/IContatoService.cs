using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface IContatoService 
    {
        Task<ContatoDto> AddContatos(ContatoDto model);
        Task<ContatoDto> UpdateContato(int contatoId, ContatoDto model);
        Task<bool> DeleteContato(int contatoId);
        
        Task<ContatoDto[]> GetAllContatosAsync(string nome);
        Task<ContatoDto> GetContatoByIdAsync(int contatoId);        
    }
}