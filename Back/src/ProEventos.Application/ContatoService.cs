using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class ContatoService : IContatoService 
    {
        private readonly IContatoPersist _contatoPersist;
        private readonly IMapper _mapper;

        public ContatoService(IContatoPersist contatoPersist,
                              IMapper mapper  )
        {
            _contatoPersist = contatoPersist;
            _mapper = mapper;
        }

        public async Task<ContatoDto> AddContatos(ContatoDto model)
        {
            try
            {
                var contato = _mapper.Map<Contato>(model);

                _contatoPersist.Add<Contato>(contato);

                if (await _contatoPersist.SaveChangesAsync()) 
                {
                    var contatoRetorno = await _contatoPersist.GetContatoByIdAsync(contato.Id);
                    return _mapper.Map<ContatoDto>(contatoRetorno);
                }
                return null;
                
            }
            catch (System.Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContatoDto> UpdateContato(int contatoId, ContatoDto model)
        {
            try
            {
                var contato = await _contatoPersist.GetContatoByIdAsync(contatoId);
                if(contato == null) return null;

                model.Id = contatoId;

                // aqui está sendo feito o mapeamento entre objetos ou seja do meu model recebendo ContatoDto para o contato
                // vou mapear do model com destino ao  contato
                _mapper.Map(model,contato);

                _contatoPersist.Update<Contato>(contato);

                if (await _contatoPersist.SaveChangesAsync()) 
                {
                    var contatoRetorno = await _contatoPersist.GetContatoByIdAsync(contato.Id);

                    return _mapper.Map<ContatoDto>(contatoRetorno);
                }
                return null;
                
            }
            catch (System.Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> DeleteContato(int contatoId)
        {
            try
            {
                var contato = await _contatoPersist.GetContatoByIdAsync(contatoId);
                if(contato == null) throw new Exception("Contato ao deletar não encontrado.");

                _contatoPersist.Delete<Contato>(contato);
                return await _contatoPersist.SaveChangesAsync();              

            }
            catch (System.Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContatoDto[]> GetAllContatosAsync(string nome)
        {
            try
            {
                var contatos = await _contatoPersist.GetAllContatosAsync(nome);
                if(contatos == null) return null;

                var resultado = _mapper.Map<ContatoDto[]>(contatos);

                return resultado;
                
            }
            catch (System.Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContatoDto> GetContatoByIdAsync(int contatoId)
        {
            try
            {
               var contato = await _contatoPersist.GetContatoByIdAsync(contatoId);
               if(contato == null) return null;

               var resultado = _mapper.Map<ContatoDto>(contato);

               return resultado;
            }
            catch (System.Exception ex)
            {                
                throw new Exception(ex.Message);
            }
        }

    }
}