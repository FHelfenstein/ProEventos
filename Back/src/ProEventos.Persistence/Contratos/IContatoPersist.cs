using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface IContatoPersist: IGeralPersist
    {
        Task<Contato[]> GetAllContatosAsync(string nome);
        Task<Contato> GetContatoByIdAsync(int id);
    }
}