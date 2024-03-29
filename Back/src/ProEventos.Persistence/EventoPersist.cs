using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence
{
    public class EventoPersist : IEventoPersist
    {
        private readonly ProEventosContext _context;           
        public EventoPersist(ProEventosContext context)
        {
            _context = context;   
         // _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;       
        }

        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedesSociais);
             
            if(includePalestrantes) 
            {
                query = query
                    .Include(e => e.PalestrantesEventos) // dado o PalestranteEventos ou seja a cada PalestranteEventos
                    .ThenInclude(pe => pe.Palestrante);  // agora inclua dentro do PalestranteEventos o Palestrante
            }

            query = query.AsNoTracking()
                            .Where( e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                                         e.Local.ToLower().Contains(pageParams.Term.ToLower())) && 
                                         e.UserId == userId)
                            .OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);

        }       
            
        public async Task<Evento> GetEventoByIdAsync(int userId,int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedesSociais);
             
            if(includePalestrantes) 
            {
                query = query
                    .Include(e => e.PalestrantesEventos) // dado o PalestranteEventos ou seja a cada PalestranteEventos
                    .ThenInclude(pe => pe.Palestrante);  // agora inclua dentro do PalestranteEventos o Palestrante
            }

            query = query.AsNoTracking()
                         .Where(e => e.Id == eventoId && e.UserId == userId)
                         .OrderBy(e => e.Id);

            return (await query.FirstOrDefaultAsync());
        }

        public async Task<int> GetAllEventosByPalestranteAsync(int userId)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(e => e.User);

            query = query.AsNoTracking()
                           .OrderBy(e => e.UserId)
                           .Where(e => e.UserId == userId);
                           
            return (await query.CountAsync());

        }
     
    }
}