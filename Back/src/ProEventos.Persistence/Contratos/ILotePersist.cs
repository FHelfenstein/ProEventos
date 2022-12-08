using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {
        
        /// <summary>
        /// Método get que retornará uma lista de lotes por eventoId
        /// </summary>
        /// <param name="eventoId">Código Chave da tabela Evento</param>
        /// <returns>Lista de Lotes</returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
        /// <summary>
        /// Método get que retornará apenas 1 lote
        /// </summary>
        /// <param name="eventoId">Código Chave da tabela Evento</param>
        /// <param name="id">Código Chave da tabela Lote</param>
        /// <returns>Apenas 1 Lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
     
    }
}