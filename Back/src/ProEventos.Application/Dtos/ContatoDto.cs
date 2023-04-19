using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class ContatoDto
    {
        public int Id { get; set; } 
        [
            Required(ErrorMessage = "O campo {0} é obrigatório."),
            StringLength(40,MinimumLength = 3,
                            ErrorMessage = "O intervalo do nome do contato deve compreender entre 3 até 40 caracteres.")
        ]
        public string Nome { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Cargo { get; set; }
        [
            Required(ErrorMessage = "O campo {0} é obrigatório."),
            Phone(ErrorMessage = "O campo {0} está com número inválido")
        ]
        public string Telefone { get; set; }
        [
            Display(Name = "e-Mail"),
            Required(ErrorMessage = "O campo {0} é obrigatório."),
            EmailAddress(ErrorMessage = "É necessário ser um {0} válido.")
        ]
        public string Email { get; set; }
                
    }
}