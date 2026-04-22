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

        public OrganizerRequestController(IOrganizerRequestService requestService)
        {
            _requestService = requestService;
        }

        public class SubmitRequestPayload
        {
            public string Message { get; set; } = string.Empty;
        }

        // POST /api/organizer-request — Attendee submits an application to be an Organizer
        [HttpPost]
        [Authorize(Roles = "Attendee")]
        public IActionResult SubmitRequest([FromBody] SubmitRequestPayload payload)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _requestService.SubmitRequest(userId, payload.Message);

            if (result.Status == OrganizerRequestResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == OrganizerRequestResultStatus.Duplicate || result.Status == OrganizerRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }

        // GET /api/organizer-request — Admin/Manager views all applications (filter by status optional)
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult GetAllRequests([FromQuery] string? status)
        {
            var result = _requestService.GetAllRequests(status);
            return Ok(result.Data);
        }

        // PUT /api/organizer-request/{id}/approve — Admin/Manager approves application
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult ApproveRequest(int id)
        {
            var result = _requestService.ApproveRequest(id);

            if (result.Status == OrganizerRequestResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == OrganizerRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }

        public class RejectRequestPayload
        {
            public string Reason { get; set; } = string.Empty;
        }

        // PUT /api/organizer-request/{id}/reject — Admin/Manager rejects application
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult RejectRequest(int id, [FromBody] RejectRequestPayload payload)
        {
            var result = _requestService.RejectRequest(id, payload.Reason);

            if (result.Status == OrganizerRequestResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == OrganizerRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }
    }
}
