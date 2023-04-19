using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class ContatoPersist: GeralPersist, IContatoPersist
    {
        private readonly ProEventosContext _context;
        public ContatoPersist(ProEventosContext context ) : base(context)
        {
            _context = context;
        }      

        public async Task<Contato[]> GetAllContatosAsync(string nome)
        {
            IQueryable<Contato> query = _context.Contatos;

            if(nome == "" || nome == null) {
                query = query.AsNoTracking()
                                .OrderBy(c => c.Nome);    
            }
            else {
            query = query.AsNoTracking()
                            .Where(c => c.Nome.ToLower().Contains(nome))  
                            .OrderBy(c => c.Nome);
            }
            
            return await query.ToArrayAsync();
        }

        public async Task<Contato> GetContatoByIdAsync(int id)
        {
            IQueryable<Contato> query = _context.Contatos;

            query = query.AsNoTracking()
                            .Where(c => c.Id == id)
                            .OrderBy(c => c.Id);
                            
            return await query.FirstOrDefaultAsync();                
        }
    }
}