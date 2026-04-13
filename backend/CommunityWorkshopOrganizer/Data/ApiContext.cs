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
        public ApiContext(DbContextOptions<ApiContext> options) : base(options) { 
        }

    }
}
