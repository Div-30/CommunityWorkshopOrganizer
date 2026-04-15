using System.ComponentModel.DataAnnotations;

namespace CommunityWorkshopOrganizer.Models
{
    public class Resource
    {
        [Key]
        public int ResourceId { get; set; }
        public int? WorkshopId { get; set; }
        public Workshop? Workshop { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ResourceUrl { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
}
