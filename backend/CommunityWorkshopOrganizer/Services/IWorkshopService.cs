using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum WorkshopResultStatus
    {
        Success,
        NotFound,
        ValidationError
    }

    public interface IWorkshopService
    {
        (WorkshopResultStatus Status, string Message, Workshop? Data) CreateWorkshop(Workshop workshop);
        (WorkshopResultStatus Status, string Message, IEnumerable<Workshop>? Data) GetAllWorkshops();
        (WorkshopResultStatus Status, string Message, Workshop? Data) GetWorkshopById(int workshopId);
    }
}