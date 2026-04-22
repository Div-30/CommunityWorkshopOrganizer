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

        public (WorkshopResultStatus Status, string Message, Workshop? Data) CreateWorkshop(Workshop workshop, int organizerId)
        {
            if (string.IsNullOrWhiteSpace(workshop.Title))
            {
                return (WorkshopResultStatus.ValidationError, "Workshop title is required.", null);
            }
            if (workshop.Capacity <= 0)
            {
                return (WorkshopResultStatus.ValidationError, "Workshop capacity must be greater than zero.", null);
            }

            // Verify the organizer exists and has the correct role
            var organizer = _context.Users.FirstOrDefault(u => u.UserId == organizerId && u.UserRole == "Organizer");
            if (organizer == null)
            {
                return (WorkshopResultStatus.NotFound, "Organizer not found.", null);
            }

            // Set OrganizerId from the authenticated token — not from request body
            workshop.OrganizerId = organizerId;
            workshop.Organizer = null!;
            workshop.Registrations = null!;
            workshop.Status = "Pending";
            workshop.CreatedAt = DateTime.UtcNow;
            // IsPaid and Price come directly from the request body

            _context.Workshops.Add(workshop);
            _context.SaveChanges();

            return (WorkshopResultStatus.Success, "Workshop created successfully.", workshop);
        }

        public (WorkshopResultStatus Status, string Message, Workshop? Data) UpdateWorkshop(int workshopId, Workshop updatedData, int organizerId)
        {
            var workshop = _context.Workshops.Find(workshopId);

            if (workshop == null)
            {
                return (WorkshopResultStatus.NotFound, "Workshop not found.", null);
            }

            // Only the organizer who owns this workshop can update it
            if (workshop.OrganizerId != organizerId)
            {
                return (WorkshopResultStatus.Forbidden, "You are not authorised to update this workshop.", null);
            }

            // Update only the allowed fields — Status and OrganizerId are not changeable here
            if (!string.IsNullOrWhiteSpace(updatedData.Title))
                workshop.Title = updatedData.Title;

            if (!string.IsNullOrWhiteSpace(updatedData.SpeakerName))
                workshop.SpeakerName = updatedData.SpeakerName;

            if (!string.IsNullOrWhiteSpace(updatedData.Description))
                workshop.Description = updatedData.Description;

            if (updatedData.EventDate != default)
                workshop.EventDate = updatedData.EventDate;

            if (updatedData.Capacity > 0)
                workshop.Capacity = updatedData.Capacity;

            workshop.IsPaid = updatedData.IsPaid;
            if (updatedData.IsPaid)
                workshop.Price = updatedData.Price;

            _context.SaveChanges();

            return (WorkshopResultStatus.Success, "Workshop updated successfully.", workshop);
        }

        public (WorkshopResultStatus Status, string Message) DeleteWorkshop(int workshopId, int organizerId)
        {
            var workshop = _context.Workshops.Find(workshopId);

            if (workshop == null)
            {
                return (WorkshopResultStatus.NotFound, "Workshop not found.");
            }

            // Only the organizer who owns this workshop can delete it
            if (workshop.OrganizerId != organizerId)
            {
                return (WorkshopResultStatus.Forbidden, "You are not authorised to delete this workshop.");
            }

            _context.Workshops.Remove(workshop);
            _context.SaveChanges();

            return (WorkshopResultStatus.Success, "Workshop deleted successfully.");
        }

        public (WorkshopResultStatus Status, string Message) ApproveWorkshop(int workshopId)
        {
            var workshop = _context.Workshops.Find(workshopId);

            if (workshop == null)
            {
                return (WorkshopResultStatus.NotFound, "Workshop not found.");
            }

            if (workshop.Status == "Approved")
            {
                return (WorkshopResultStatus.ValidationError, "This workshop is already approved.");
            }

            workshop.Status = "Approved";
            _context.SaveChanges();

            return (WorkshopResultStatus.Success, $"Workshop '{workshop.Title}' has been officially approved!");
        }

        public (WorkshopResultStatus Status, string Message) RejectWorkshop(int workshopId, string reason)
        {
            var workshop = _context.Workshops.Find(workshopId);

            if (workshop == null)
            {
                return (WorkshopResultStatus.NotFound, "Workshop not found.");
            }

            if (workshop.Status == "Rejected")
            {
                return (WorkshopResultStatus.ValidationError, "This workshop is already rejected.");
            }

            workshop.Status = "Rejected";
            workshop.RejectionReason = reason;
            _context.SaveChanges();

            return (WorkshopResultStatus.Success, $"Workshop '{workshop.Title}' has been rejected.");
        }

        public (WorkshopResultStatus Status, string Message, IEnumerable<Workshop>? Data) GetAllWorkshops(string? status = null)
        {
            var query = _context.Workshops.Include(w => w.Organizer).AsQueryable();
            
            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(w => w.Status == status);
            }

            var workshops = query.OrderBy(w => w.EventDate).ToList();

            return (WorkshopResultStatus.Success, "Workshops retrieved.", workshops);
        }

        public (WorkshopResultStatus Status, string Message, IEnumerable<Workshop>? Data) GetWorkshopsByOrganizer(int organizerId)
        {
            var workshops = _context.Workshops
                .Where(w => w.OrganizerId == organizerId)
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