using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganiserRequestController : ControllerBase
    {
        private readonly IOrganiserRequestService _requestService;

        public OrganiserRequestController(IOrganiserRequestService requestService)
        {
            _requestService = requestService;
        }

        public class SubmitRequestPayload
        {
            public string Message { get; set; } = string.Empty;
        }

        // POST /api/organiser-request — Attendee submits an application to be an Organiser
        [HttpPost]
        [Authorize(Roles = "Attendee")]
        public IActionResult SubmitRequest([FromBody] SubmitRequestPayload payload)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _requestService.SubmitRequest(userId, payload.Message);

            if (result.Status == OrganiserRequestResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == OrganiserRequestResultStatus.Duplicate || result.Status == OrganiserRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }

        // GET /api/organiser-request — Admin views all applications (filter by status optional)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllRequests([FromQuery] string? status)
        {
            var result = _requestService.GetAllRequests(status);
            return Ok(result.Data);
        }

        // PUT /api/organiser-request/{id}/approve — Admin approves application
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public IActionResult ApproveRequest(int id)
        {
            var result = _requestService.ApproveRequest(id);

            if (result.Status == OrganiserRequestResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == OrganiserRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }

        public class RejectRequestPayload
        {
            public string Reason { get; set; } = string.Empty;
        }

        // PUT /api/organiser-request/{id}/reject — Admin rejects application
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public IActionResult RejectRequest(int id, [FromBody] RejectRequestPayload payload)
        {
            var result = _requestService.RejectRequest(id, payload.Reason);

            if (result.Status == OrganiserRequestResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == OrganiserRequestResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }
    }
}
