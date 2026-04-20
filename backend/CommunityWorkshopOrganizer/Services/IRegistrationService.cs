using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum RegistrationResultStatus
    {
        Success,
        NotFound,
        Duplicate,
        ValidationError,
        Forbidden
    }

    public interface IRegistrationService
    {
        (RegistrationResultStatus Status, string Message, Registration? Data) RegisterUser(int userId, int workshopId);
        (RegistrationResultStatus Status, string Message) CancelRegistration(int registrationId, int userId);
        (RegistrationResultStatus Status, string Message, IEnumerable<Registration>? Data) GetAttendees(int workshopId);
        (RegistrationResultStatus Status, string Message, IEnumerable<Registration>? Data) GetUserRegistrations(int userId);
    }
}