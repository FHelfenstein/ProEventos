using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Dtos;

namespace ProEventos.Application
{
    public interface ILoteService 
    {
        Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models);
        Task<bool> DeleteLote(int eventoId, int loteId);

        Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId);
        Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId);
    }
}