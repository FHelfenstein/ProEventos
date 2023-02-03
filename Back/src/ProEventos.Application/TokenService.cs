using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;

namespace ProEventos.Application
{
    public class TokenService : ITokenService
    {
        
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public readonly SymmetricSecurityKey _Key;

        public TokenService() {
            
        }
        public TokenService(IConfiguration config,
                            UserManager<User> userManager,
                            IMapper mapper)
        {
            _config = config;
            _userManager = userManager;
            _mapper = mapper;

            /// <summary>
            /// geração da chave secreta do Token
            /// </summary>
            /// <returns></returns>
            _Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }
        
        public async Task<string> CreateToken(UserUpdateDto userUpdateDto)
        {
            var user = _mapper.Map<User>(userUpdateDto);

            /// <summary>
            /// claims são afirmações por exemplo na minha identidade tenho o nome , número da identidade , nome do pai , nome da mãe
            /// são detalhes caracterísitcas da identidade aqui iremos criar as características do meu usuário
            /// </summary>
            /// <value></value>
            var claims = new List<Claim> 
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            /// <summary>
            /// definiindo minha assinatura / credencial / algoritmo de cálculo
            /// </summary>
            /// <returns></returns>
            var creds = new SigningCredentials(_Key, SecurityAlgorithms.HmacSha512Signature);

            /// <summary>
            /// definindo a estrutura do meu Token
            /// </summary>
            /// <value></value>
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            /// <summary>
            /// utilizo esse token no formato Jwt
            /// </summary>
            /// <returns></returns>
            var tokenHandler = new JwtSecurityTokenHandler();

            /// <summary>
            /// crio o meu token
            /// </summary>
            /// <returns></returns>
            var token = tokenHandler.CreateToken(tokenDescription);

            /// <summary>
            /// retorna o token gerado
            /// </summary>
            /// <returns></returns>            
            return tokenHandler.WriteToken(token);
            
        }
    }
}