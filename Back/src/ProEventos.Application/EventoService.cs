using System;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;

        public EventoService() { }
        
        public EventoService(IGeralPersist geralPersist,
                             IEventoPersist eventoPersist,
                             IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
            _mapper = mapper;            
        }
        public async Task<EventoDto> AddEventos(int userId, EventoDto model)
        {
            try
            {
                // mapeamento de EventoDto -> para evento
                var evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;

              _geralPersist.Add<Evento>(evento);
              if ( await _geralPersist.SaveChangesAsync()) 
              {
                // mapeamento de eventoRetornado -> para EventoDto
                var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id,false);
                return _mapper.Map<EventoDto>(eventoRetorno);

              }  
              return null;

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            } 
        }

        public async Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto model)
        {            
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId,false);
                if (evento == null ) return null;

                model.Id = eventoId;
                model.UserId = userId;

                // aqui está sendo feito o mapeamento entre objetos ou seja do meu model recebendo EventoDto para o evento
                // vou mapear do model com destino ao evento
                _mapper.Map(model, evento);

                _geralPersist.Update<Evento>(evento);
                if(await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id,false);
                    return _mapper.Map<EventoDto>(eventoRetorno);

                }
                return null;

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            } 
        }

        public async Task<bool> DeleteEvento(int userId, int eventoId)
        {
        try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId,false);
                if (evento == null ) throw new Exception("Evento ao deletar não encontrado!");
                
                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }            
        }

        public async Task<PageList<EventoDto>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {

            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId, pageParams, includePalestrantes);

                if(eventos == null) return null;
                
                var resultado = _mapper.Map<PageList<EventoDto>>(eventos);

                resultado.CurrentPage = eventos.CurrentPage;   
                resultado.TotalPages  = eventos.TotalPages;
                resultado.PageSize = eventos.PageSize;
                resultado.TotalCount = eventos.TotalCount;
                
                return resultado;
                
            }
            catch (Exception ex)
            {                
                throw new Exception(ex.Message);
            }            
        }
        
        public async Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId,includePalestrantes);
                if(evento == null) return null;

                // dado o meu objeto EventoDto mapear o evento que foi retornado acima 
                var resultado = _mapper.Map<EventoDto>(evento);
                return resultado;                
                
            }
            catch (Exception ex)
            {
             
                throw new Exception(ex.Message);
            }
        }  

        public async Task<int> GetAllEventosByPalestranteAsync(int userId) 
        {
            try
            {
                var totalEventos = await _eventoPersist.GetAllEventosByPalestranteAsync(userId);
                return totalEventos;
                
            }
            catch (System.Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }     
    }
}