using CommunityWorkshopOrganizer.Models;

namespace CommunityWorkshopOrganizer.Services
{
    public enum OrganizerRequestResultStatus
    {
        Success,
        NotFound,
        Duplicate,
        ValidationError
    }

    public interface IOrganizerRequestService
    {
        (OrganizerRequestResultStatus Status, string Message, OrganizerRequest? Data) SubmitRequest(int userId, string message);
        (OrganizerRequestResultStatus Status, string Message, IEnumerable<OrganizerRequest>? Data) GetAllRequests(string? status = null);
        (OrganizerRequestResultStatus Status, string Message) ApproveRequest(int requestId);
        (OrganizerRequestResultStatus Status, string Message) RejectRequest(int requestId, string reason);
    }
}
