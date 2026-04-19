using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum RegistrationResultStatus
    {
        Success,
        NotFound,
        Duplicate,
        ValidationError
    }

    public interface IRegistrationService
    {
        (RegistrationResultStatus Status, string Message, Registration? Data) RegisterUser(Registration registration);
        (RegistrationResultStatus Status, string Message, IEnumerable<Registration>? Data) GetAttendees(int workshopId);
    }
}