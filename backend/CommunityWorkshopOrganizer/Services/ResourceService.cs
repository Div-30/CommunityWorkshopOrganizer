using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Services
{
    public class ResourceService : IResourceService
    {
        private readonly ApiContext _context;

        public ResourceService(ApiContext context)
        {
            _context = context;
        }

        public (ResourceResultStatus Status, string Message, Resource? Data) AddResource(Resource resource, int organizerId)
        {
            if (string.IsNullOrWhiteSpace(resource.Title) || string.IsNullOrWhiteSpace(resource.ResourceUrl))
            {
                return (ResourceResultStatus.ValidationError, "Resource title and URL are required.", null);
            }

            var workshop = _context.Workshops.Find(resource.WorkshopId);
            if (workshop == null)
            {
                return (ResourceResultStatus.NotFound, "Workshop not found.", null);
            }

            // Only the organiser who owns this workshop can add resources to it
            if (workshop.OrganizerId != organizerId)
            {
                return (ResourceResultStatus.Forbidden, "You are not authorised to add resources to this workshop.", null);
            }

            resource.UploadedAt = DateTime.UtcNow;
            resource.Workshop = null!;

            _context.Resources.Add(resource);
            _context.SaveChanges();

            return (ResourceResultStatus.Success, "Resource added successfully.", resource);
        }

        public (ResourceResultStatus Status, string Message) DeleteResource(int resourceId, int organizerId)
        {
            var resource = _context.Resources
                .Include(r => r.Workshop)
                .FirstOrDefault(r => r.ResourceId == resourceId);

            if (resource == null)
            {
                return (ResourceResultStatus.NotFound, "Resource not found.");
            }

            // Only the organiser who owns the parent workshop can delete its resources
            if (resource.Workshop?.OrganizerId != organizerId)
            {
                return (ResourceResultStatus.Forbidden, "You are not authorised to delete this resource.");
            }

            _context.Resources.Remove(resource);
            _context.SaveChanges();

            return (ResourceResultStatus.Success, "Resource deleted successfully.");
        }

        public (ResourceResultStatus Status, string Message, IEnumerable<Resource>? Data) GetResourcesByWorkshop(int workshopId, int userId, string userRole)
        {
            var workshop = _context.Workshops.Find(workshopId);
            if (workshop == null)
            {
                return (ResourceResultStatus.NotFound, "Workshop not found.", null);
            }

            // Admins can always view resources
            if (userRole == "Admin")
            {
                var resources = FetchResources(workshopId);
                return (ResourceResultStatus.Success, "Resources retrieved.", resources);
            }

            // Organisers can only view resources for their own workshop
            if (userRole == "Organiser")
            {
                if (workshop.OrganizerId != userId)
                    return (ResourceResultStatus.Forbidden, "You are not authorised to view resources for this workshop.", null);

                var resources = FetchResources(workshopId);
                return (ResourceResultStatus.Success, "Resources retrieved.", resources);
            }

            // Attendees can only view resources if they have a Confirmed registration
            if (userRole == "Attendee")
            {
                var hasConfirmedBooking = _context.Registrations.Any(
                    r => r.WorkshopId == workshopId && r.UserId == userId && r.Status == "Confirmed");

                if (!hasConfirmedBooking)
                    return (ResourceResultStatus.Forbidden, "You must have a confirmed booking for this workshop to access its resources.", null);

                var resources = FetchResources(workshopId);
                return (ResourceResultStatus.Success, "Resources retrieved.", resources);
            }

            return (ResourceResultStatus.Forbidden, "Access denied.", null);
        }

        private List<Resource> FetchResources(int workshopId) =>
            _context.Resources
                .Where(r => r.WorkshopId == workshopId)
                .OrderBy(r => r.UploadedAt)
                .ToList();
    }
}
