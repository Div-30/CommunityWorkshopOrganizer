using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityWorkshopOrganizer.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        [NotMapped]
        public string Password { get; set; } = string.Empty;

        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty; // "Attendee" or "Organizer"
        public DateTime CreatedAt { get; set; }
        
        public List<Workshop> Workshops { get; set; } = new ();
        public List<Registration> Registrations { get; set; } = new ();

    }
}
