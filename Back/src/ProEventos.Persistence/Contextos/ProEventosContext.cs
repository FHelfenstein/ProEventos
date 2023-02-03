using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : IdentityDbContext<User, Role, int, 
                                                       IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, 
                                                       IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options) : base(options)  { }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestrantesEventos { get; set; }
        public DbSet<RedeSocial> RedesSociais { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole => 
                {
                    userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                    userRole.HasOne(ur => ur.Role)       // uma UserRole tem uma Role
                            .WithMany(r => r.UserRoles) // minha Role tem muitas UserRoles
                            .HasForeignKey(ur => ur.RoleId)
                            .IsRequired();

                    userRole.HasOne(ur => ur.User)       
                            .WithMany(r => r.UserRoles) 
                            .HasForeignKey(ur => ur.UserId)
                            .IsRequired();                            
                }
                        
            );
                
            
            modelBuilder.Entity<PalestranteEvento>()
                .HasKey(PE => new{PE.EventoId, PE.PalestranteId});

            modelBuilder.Entity<Evento>()    
                .HasMany(e => e.RedesSociais)  // um evento tem muitas redes sociais
                .WithOne(rs => rs.Evento)      // cada rede social tem um evento
                .OnDelete(DeleteBehavior.Cascade); // deletou o evento e esse evento possui redes sociais então delete em cascade

            modelBuilder.Entity<Palestrante>()
                .HasMany(e => e.RedesSociais)    
                .WithOne(rs => rs.Palestrante)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
        
}