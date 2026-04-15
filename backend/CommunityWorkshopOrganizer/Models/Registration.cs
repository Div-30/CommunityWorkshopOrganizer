using System.ComponentModel.DataAnnotations;

namespace CommunityWorkshopOrganizer.Models
{
    public class Registration
    {
        [Key]
        public int RegistrationId { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }
        public int? WorkshopId { get; set; }
        public Workshop? Workshop { get; set; }
        public string Status { get; set; } = string.Empty; // "Confirmed", "Waitlisted", "Cancelled"
        public DateTime RegisteredAt { get; set; }
    }
}
