using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Services
{
    public class WorkshopService : IWorkshopService
    {
        private readonly ApiContext _context;

        public WorkshopService(ApiContext context)
        {
            _context = context;
        }

        public (WorkshopResultStatus Status, string Message, Workshop? Data) CreateWorkshop(Workshop workshop)
        {
            if (string.IsNullOrWhiteSpace(workshop.Title))
            {
                return (WorkshopResultStatus.ValidationError, "Workshop title is required.", null);
            }
            if (workshop.Capacity <= 0)
            {
                return (WorkshopResultStatus.ValidationError, "Workshop capacity must be greater than zero.", null);
            }
            var organizerExists = _context.Users.Any(u => u.UserId == workshop.OrganizerId);
            if (!organizerExists)
            {
                return (WorkshopResultStatus.NotFound, "Organizer not found. Please provide a valid OrganizerId.", null);
            }

            workshop.Organizer = null!; 
            workshop.Registrations = null!;

            workshop.CreatedAt = DateTime.UtcNow;

            _context.Workshops.Add(workshop);
            _context.SaveChanges();

            return (WorkshopResultStatus.Success, "Workshop created successfully.", workshop);
        }

        public (WorkshopResultStatus Status, string Message, IEnumerable<Workshop>? Data) GetAllWorkshops()
        {
            var workshops = _context.Workshops
                .Include(w => w.Organizer)
                .OrderBy(w => w.EventDate)
                .ToList();

            return (WorkshopResultStatus.Success, "Workshops retrieved.", workshops);
        }

        public (WorkshopResultStatus Status, string Message, Workshop? Data) GetWorkshopById(int workshopId)
        {
            var workshop = _context.Workshops
                .Include(w => w.Organizer)
                .FirstOrDefault(w => w.WorkshopId == workshopId);
            
            if (workshop == null)
            {
                return (WorkshopResultStatus.NotFound, "Workshop not found.", null);
            }

            return (WorkshopResultStatus.Success, "Workshop found.", workshop);
        }
    }
}