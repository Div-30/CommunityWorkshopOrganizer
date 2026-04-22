using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizerRequestController : ControllerBase
    {
        private readonly IOrganizerRequestService _requestService;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;

        public OrganizerRequestController(
            IOrganizerRequestService requestService,
            IUserService userService,
            IEmailService emailService)
        {
            _requestService = requestService;
            _userService = userService;
            _emailService = emailService;
        }

        // POST /api/organizerrequest — Attendee only
        [HttpPost]
        [Authorize(Roles = "Attendee")]
        public IActionResult SubmitRequest([FromBody] OrganizerRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _requestService.SubmitRequest(userId, request.Message);

            if (result.Status == OrganizerRequestResultStatus.Duplicate)
                return BadRequest(result.Message);
            if (result.Status == OrganizerRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }

        // GET /api/organizerrequest — Admin/Manager only
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult GetAllRequests([FromQuery] string? status)
        {
            var result = _requestService.GetAllRequests(status);
            return Ok(result.Data);
        }

        // PUT /api/organizerrequest/{id}/approve — Admin/Manager only
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult ApproveRequest(int id)
        {
            var result = _requestService.ApproveRequest(id);

            if (result.Status == OrganizerRequestResultStatus.NotFound)
                return NotFound(result.Message);
            if (result.Status == OrganizerRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            // Notify user by email
            _ = Task.Run(async () =>
            {
                var req = _requestService.GetAllRequests(null).Data?.FirstOrDefault(r => r.RequestId == id);
                if (req?.UserId != null)
                {
                    var user = _userService.GetUserById(req.UserId).Data;
                    if (user != null)
                    {
                        await _emailService.SendAsync(
                            user.Email, user.FullName,
                            "🚀 You're Now an Organizer!",
                            EmailTemplates.OrganizerRequestApproved(user.FullName));
                    }
                }
            });

            return Ok(new { Message = result.Message });
        }

        public class RejectRequestBody { public string Reason { get; set; } = string.Empty; }

        // PUT /api/organizerrequest/{id}/reject — Admin/Manager only
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult RejectRequest(int id, [FromBody] RejectRequestBody body)
        {
            if (string.IsNullOrWhiteSpace(body.Reason))
                return BadRequest("A reason is required.");

            var result = _requestService.RejectRequest(id, body.Reason);

            if (result.Status == OrganizerRequestResultStatus.NotFound)
                return NotFound(result.Message);
            if (result.Status == OrganizerRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            // Notify user by email
            _ = Task.Run(async () =>
            {
                var req = _requestService.GetAllRequests(null).Data?.FirstOrDefault(r => r.RequestId == id);
                if (req?.UserId != null)
                {
                    var user = _userService.GetUserById(req.UserId).Data;
                    if (user != null)
                    {
                        await _emailService.SendAsync(
                            user.Email, user.FullName,
                            "Organizer Application Update",
                            EmailTemplates.OrganizerRequestRejected(user.FullName, body.Reason));
                    }
                }
            });

            return Ok(new { Message = result.Message });
        }
    }
}
