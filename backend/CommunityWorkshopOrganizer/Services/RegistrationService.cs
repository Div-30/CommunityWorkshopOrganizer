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

        public (RegistrationResultStatus Status, string Message, Registration? Data) RegisterUser(int userId, int workshopId)
        {
            var workshop = _context.Workshops.Find(workshopId);
            if (workshop == null)
            {
                return (RegistrationResultStatus.NotFound, "Workshop not found.", null);
            }

            // Attendees can only book approved workshops
            if (workshop.Status != "Approved")
            {
                return (RegistrationResultStatus.ValidationError, "This workshop is not yet approved and cannot be booked.", null);
            }

            var existingRegistration = _context.Registrations
                .FirstOrDefault(r => r.UserId == userId && r.WorkshopId == workshopId);

            if (existingRegistration != null)
            {
                return (RegistrationResultStatus.Duplicate, "You are already registered for this workshop.", null);
            }

            var currentAttendees = _context.Registrations
                .Count(r => r.WorkshopId == workshopId && r.Status == "Confirmed");

            var registration = new Registration
            {
                UserId = userId,
                WorkshopId = workshopId,
                Status = currentAttendees >= workshop.Capacity ? "Waitlisted" : "Confirmed",
                RegisteredAt = DateTime.UtcNow
            };

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            return (RegistrationResultStatus.Success, "Registration successful.", registration);
        }

        public (RegistrationResultStatus Status, string Message) CancelRegistration(int registrationId, int userId)
        {
            var registration = _context.Registrations.Find(registrationId);

            if (registration == null)
            {
                return (RegistrationResultStatus.NotFound, "Registration not found.");
            }

            // Attendees can only cancel their own registrations
            if (registration.UserId != userId)
            {
                return (RegistrationResultStatus.Forbidden, "You are not authorised to cancel this registration.");
            }

            if (registration.Status == "Cancelled")
            {
                return (RegistrationResultStatus.ValidationError, "This registration is already cancelled.");
            }

            var wasConfirmed = registration.Status == "Confirmed";
            registration.Status = "Cancelled";

            // Auto-promote the first waitlisted attendee if a confirmed spot just freed up
            if (wasConfirmed)
            {
                var nextWaitlisted = _context.Registrations
                    .Where(r => r.WorkshopId == registration.WorkshopId && r.Status == "Waitlisted")
                    .OrderBy(r => r.RegisteredAt)
                    .FirstOrDefault();

                if (nextWaitlisted != null)
                {
                    nextWaitlisted.Status = "Confirmed";
                }
            }

            _context.SaveChanges();

            return (RegistrationResultStatus.Success, "Registration cancelled successfully.");
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

        public (RegistrationResultStatus Status, string Message, IEnumerable<Registration>? Data) GetUserRegistrations(int userId)
        {
            var userExists = _context.Users.Any(u => u.UserId == userId);
            if (!userExists)
            {
                return (RegistrationResultStatus.NotFound, "User not found.", null);
            }

            var registrations = _context.Registrations
                .Include(r => r.Workshop)
                .Where(r => r.UserId == userId)
                .OrderBy(r => r.RegisteredAt)
                .ToList();

            return (RegistrationResultStatus.Success, "User registrations retrieved.", registrations);
        }
    }
}