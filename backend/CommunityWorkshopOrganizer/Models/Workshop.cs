namespace CommunityWorkshopOrganizer.Models
{
    public class Workshop
    {
        public int WorkshopId { get; set; }
        public int? OrganizerId { get; set; }
        public User? Organizer { get; set; }
        public string Title { get; set; } = string.Empty;
        public string SpeakerName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public int Capacity { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<Registration> Registrations { get; set; } = new ();
        public List<Resource> Resources { get; set; } = new ();
    }
}
