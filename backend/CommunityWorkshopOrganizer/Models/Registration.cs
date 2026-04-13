namespace CommunityWorkshopOrganizer.Models
{
    public class Registration
    {
        public int RegistrationId { get; set; }
        public int UserId { get; set; }
        public int WorkshopId { get; set; }
        public string Status { get; set; } = string.Empty; // "Confirmed", "Waitlisted", "Cancelled"
        public DateTime RegisteredAt { get; set; }
    }
}
