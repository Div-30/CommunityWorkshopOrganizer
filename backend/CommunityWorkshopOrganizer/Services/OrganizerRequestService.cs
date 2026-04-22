using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Services
{
    public class OrganizerRequestService : IOrganizerRequestService
    {
        private readonly ApiContext _context;

        public OrganizerRequestService(ApiContext context)
        {
            _context = context;
        }

        public (OrganizerRequestResultStatus Status, string Message, OrganizerRequest? Data) SubmitRequest(int userId, string message)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return (OrganizerRequestResultStatus.NotFound, "User not found.", null);
            }

            if (user.UserRole == "Organizer" || user.UserRole == "Admin")
            {
                return (OrganizerRequestResultStatus.ValidationError, "User is already an organizer or admin.", null);
            }

            var hasPendingRequest = _context.OrganizerRequests
                .Any(r => r.UserId == userId && r.Status == "Pending");

            if (hasPendingRequest)
            {
                return (OrganizerRequestResultStatus.Duplicate, "You already have a pending request.", null);
            }

            var request = new OrganizerRequest
            {
                UserId = userId,
                Message = message,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.OrganizerRequests.Add(request);
            _context.SaveChanges();

            return (OrganizerRequestResultStatus.Success, "Organizer request submitted successfully.", request);
        }

        public (OrganizerRequestResultStatus Status, string Message, IEnumerable<OrganizerRequest>? Data) GetAllRequests(string? status = null)
        {
            var query = _context.OrganizerRequests.Include(r => r.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(r => r.Status == status);
            }

            var requests = query.OrderBy(r => r.CreatedAt).ToList();

            return (OrganizerRequestResultStatus.Success, "Requests retrieved.", requests);
        }

        public (OrganizerRequestResultStatus Status, string Message) ApproveRequest(int requestId)
        {
            var request = _context.OrganizerRequests.Include(r => r.User).FirstOrDefault(r => r.RequestId == requestId);
            if (request == null)
            {
                return (OrganizerRequestResultStatus.NotFound, "Request not found.");
            }

            if (request.Status != "Pending")
            {
                return (OrganizerRequestResultStatus.ValidationError, "Only pending requests can be approved.");
            }

            request.Status = "Approved";

            if (request.User != null)
            {
                request.User.UserRole = "Organizer";
            }

            _context.SaveChanges();

            return (OrganizerRequestResultStatus.Success, $"Request approved. '{request.User?.FullName}' is now an Organizer.");
        }

        public (OrganizerRequestResultStatus Status, string Message) RejectRequest(int requestId, string reason)
        {
            var request = _context.OrganizerRequests.Find(requestId);
            if (request == null)
            {
                return (OrganizerRequestResultStatus.NotFound, "Request not found.");
            }

            if (request.Status != "Pending")
            {
                return (OrganizerRequestResultStatus.ValidationError, "Only pending requests can be rejected.");
            }

            if (string.IsNullOrWhiteSpace(reason))
            {
                return (OrganizerRequestResultStatus.ValidationError, "A reason must be provided when rejecting a request.");
            }

            request.Status = "Rejected";
            request.RejectionReason = reason;

            _context.SaveChanges();

            return (OrganizerRequestResultStatus.Success, "Request rejected successfully.");
        }
    }
}
