using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Services
{
    public class OrganiserRequestService : IOrganiserRequestService
    {
        private readonly ApiContext _context;

        public OrganiserRequestService(ApiContext context)
        {
            _context = context;
        }

        public (OrganiserRequestResultStatus Status, string Message, OrganiserRequest? Data) SubmitRequest(int userId, string message)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return (OrganiserRequestResultStatus.NotFound, "User not found.", null);
            }

            if (user.UserRole == "Organiser" || user.UserRole == "Admin")
            {
                return (OrganiserRequestResultStatus.ValidationError, "User is already an organiser or admin.", null);
            }

            var hasPendingRequest = _context.OrganiserRequests
                .Any(r => r.UserId == userId && r.Status == "Pending");

            if (hasPendingRequest)
            {
                return (OrganiserRequestResultStatus.Duplicate, "You already have a pending request.", null);
            }

            var request = new OrganiserRequest
            {
                UserId = userId,
                Message = message,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.OrganiserRequests.Add(request);
            _context.SaveChanges();

            return (OrganiserRequestResultStatus.Success, "Organiser request submitted successfully.", request);
        }

        public (OrganiserRequestResultStatus Status, string Message, IEnumerable<OrganiserRequest>? Data) GetAllRequests(string? status = null)
        {
            var query = _context.OrganiserRequests.Include(r => r.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(r => r.Status == status);
            }

            var requests = query.OrderBy(r => r.CreatedAt).ToList();

            return (OrganiserRequestResultStatus.Success, "Requests retrieved.", requests);
        }

        public (OrganiserRequestResultStatus Status, string Message) ApproveRequest(int requestId)
        {
            var request = _context.OrganiserRequests.Include(r => r.User).FirstOrDefault(r => r.RequestId == requestId);
            if (request == null)
            {
                return (OrganiserRequestResultStatus.NotFound, "Request not found.");
            }

            if (request.Status != "Pending")
            {
                return (OrganiserRequestResultStatus.ValidationError, "Only pending requests can be approved.");
            }

            request.Status = "Approved";

            if (request.User != null)
            {
                request.User.UserRole = "Organiser";
            }

            _context.SaveChanges();

            return (OrganiserRequestResultStatus.Success, $"Request approved. '{request.User?.FullName}' is now an Organiser.");
        }

        public (OrganiserRequestResultStatus Status, string Message) RejectRequest(int requestId, string reason)
        {
            var request = _context.OrganiserRequests.Find(requestId);
            if (request == null)
            {
                return (OrganiserRequestResultStatus.NotFound, "Request not found.");
            }

            if (request.Status != "Pending")
            {
                return (OrganiserRequestResultStatus.ValidationError, "Only pending requests can be rejected.");
            }

            if (string.IsNullOrWhiteSpace(reason))
            {
                return (OrganiserRequestResultStatus.ValidationError, "A reason must be provided when rejecting a request.");
            }

            request.Status = "Rejected";
            request.RejectionReason = reason;

            _context.SaveChanges();

            return (OrganiserRequestResultStatus.Success, "Request rejected successfully.");
        }
    }
}
