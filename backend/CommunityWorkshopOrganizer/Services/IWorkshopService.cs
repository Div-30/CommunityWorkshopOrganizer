using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum WorkshopResultStatus
    {
        Success,
        NotFound,
        ValidationError,
        Forbidden
    }

    public interface IWorkshopService
    {
        (WorkshopResultStatus Status, string Message, Workshop? Data) CreateWorkshop(Workshop workshop, int organizerId);
        (WorkshopResultStatus Status, string Message, Workshop? Data) UpdateWorkshop(int workshopId, Workshop updatedData, int organizerId);
        (WorkshopResultStatus Status, string Message) DeleteWorkshop(int workshopId, int organizerId);
        (WorkshopResultStatus Status, string Message) ApproveWorkshop(int workshopId);
        (WorkshopResultStatus Status, string Message) RejectWorkshop(int workshopId, string reason);
        (WorkshopResultStatus Status, string Message, IEnumerable<Workshop>? Data) GetAllWorkshops(string? status = null);
        (WorkshopResultStatus Status, string Message, IEnumerable<Workshop>? Data) GetWorkshopsByOrganizer(int organizerId);
        (WorkshopResultStatus Status, string Message, Workshop? Data) GetWorkshopById(int workshopId);
    }
}