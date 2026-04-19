using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public interface IRegistrationService
    {
        (bool Success, string Message, Registration? Data) RegisterUser(Registration registration);
        (bool Success, string Message, IEnumerable<Registration>? Data) GetAttendees(int workshopId);
    }
}