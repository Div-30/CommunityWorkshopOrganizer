using System.ComponentModel.DataAnnotations;

namespace CommunityWorkshopOrganizer.Models
{
    public class OrganizerRequest
    {
        [Key]
        public int RequestId { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public string Message { get; set; } = string.Empty;

        // "Pending", "Approved", "Rejected"
        public string Status { get; set; } = "Pending";

        public string? RejectionReason { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
