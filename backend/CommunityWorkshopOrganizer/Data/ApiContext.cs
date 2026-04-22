using CommunityWorkshopOrganizer.Models;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Data
{
    public class ApiContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Workshop> Workshops { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<OrganizerRequest> OrganizerRequests { get; set; }
        public ApiContext(DbContextOptions<ApiContext> options) : base(options) { 
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // This acts as a backup in case Program.cs isn't read during migration
                optionsBuilder.UseSqlite("Data Source=CommunityWorkshopDatabase.db");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        { 

            modelBuilder.Entity<User>()
                .HasMany(u => u.Workshops)
                .WithOne(w => w.Organizer)
                .HasForeignKey(w => w.OrganizerId)
                .OnDelete(DeleteBehavior.Cascade); 

          modelBuilder.Entity<User>()
                .HasMany(u => u.Registrations)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade); 

          modelBuilder.Entity<Workshop>()
                .HasMany(w => w.Registrations)
                .WithOne(r => r.Workshop)
                .HasForeignKey(r => r.WorkshopId)
                .OnDelete(DeleteBehavior.Cascade);

          modelBuilder.Entity<Workshop>()
                .HasMany(w => w.Resources)
                .WithOne(r => r.Workshop)
                .HasForeignKey(r => r.WorkshopId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
