using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application
{
    public interface IPalestranteService
    {
        Task<PalestranteDto> AddPalestrantes(int userId, PalestranteAddDto model);
        Task<PalestranteDto> UpdatePalestrante(int userId, PalestranteUpdateDto model);  

        Task<PageList<PalestranteDto>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
        Task<PalestranteDto> GetPalestranteByUserIdAsync(int userId, bool  includeEventos = false);
    }
}