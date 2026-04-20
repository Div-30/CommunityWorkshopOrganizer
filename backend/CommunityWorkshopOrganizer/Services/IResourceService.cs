using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum ResourceResultStatus
    {
        Success,
        NotFound,
        ValidationError,
        Forbidden
    }

    public interface IResourceService
    {
        (ResourceResultStatus Status, string Message, Resource? Data) AddResource(Resource resource, int organizerId);
        (ResourceResultStatus Status, string Message) DeleteResource(int resourceId, int organizerId);
        (ResourceResultStatus Status, string Message, IEnumerable<Resource>? Data) GetResourcesByWorkshop(int workshopId, int userId, string userRole);
    }
}
