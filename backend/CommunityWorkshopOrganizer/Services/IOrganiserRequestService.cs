using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum OrganiserRequestResultStatus
    {
        Success,
        NotFound,
        Duplicate,
        ValidationError
    }

    public interface IOrganiserRequestService
    {
        (OrganiserRequestResultStatus Status, string Message, OrganiserRequest? Data) SubmitRequest(int userId, string message);
        (OrganiserRequestResultStatus Status, string Message, IEnumerable<OrganiserRequest>? Data) GetAllRequests(string? status = null);
        (OrganiserRequestResultStatus Status, string Message) ApproveRequest(int requestId);
        (OrganiserRequestResultStatus Status, string Message) RejectRequest(int requestId, string reason);
    }
}
