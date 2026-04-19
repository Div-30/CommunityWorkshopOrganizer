using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly ApiContext _context;

        public RegistrationService(ApiContext context)
        {
            _context = context;
        }

        public (RegistrationResultStatus Status, string Message, Registration? Data) RegisterUser(Registration registration)
        {
            var workshop = _context.Workshops.Find(registration.WorkshopId);
            if (workshop == null) 
            {
                return (RegistrationResultStatus.NotFound, "Workshop not found.", null);
            }

            var existingRegistration = _context.Registrations
                .FirstOrDefault(r => r.UserId == registration.UserId && r.WorkshopId == registration.WorkshopId);
            
            if (existingRegistration != null) 
            {
                return (RegistrationResultStatus.Duplicate, "This user is already registered for this workshop.", null);
            }

            var currentAttendees = _context.Registrations
                .Count(r => r.WorkshopId == registration.WorkshopId && r.Status == "Confirmed");

            registration.Status = currentAttendees >= workshop.Capacity ? "Waitlisted" : "Confirmed";
            registration.RegisteredAt = DateTime.UtcNow;

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            return (RegistrationResultStatus.Success, "Registration successful.", registration);
        }

        public (RegistrationResultStatus Status, string Message, IEnumerable<Registration>? Data) GetAttendees(int workshopId)
        {
            var workshopExists = _context.Workshops.Any(w => w.WorkshopId == workshopId);
            if (!workshopExists) 
            {
                return (RegistrationResultStatus.NotFound, "Workshop not found.", null);
            }

            var attendees = _context.Registrations
                .Include(r => r.User) 
                .Where(r => r.WorkshopId == workshopId)
                .OrderBy(r => r.RegisteredAt)
                .ToList();

            return (RegistrationResultStatus.Success, "Attendees retrieved.", attendees);
        }
    }
}