using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshopController : ControllerBase
    {
        private readonly IWorkshopService _workshopService;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;

        public WorkshopController(IWorkshopService workshopService, IUserService userService, IEmailService emailService)
        {
            _workshopService = workshopService;
            _userService = userService;
            _emailService = emailService;
        }

        // GET /api/workshop — public
        [HttpGet]
        public ActionResult<IEnumerable<Workshop>> GetAllWorkshops([FromQuery] string? status)
        {
            var result = _workshopService.GetAllWorkshops(status);
            return Ok(result.Data);
        }

        // GET /api/workshop/my — Organizer only
        [HttpGet("my")]
        [Authorize(Roles = "Organizer")]
        public ActionResult<IEnumerable<Workshop>> GetMyWorkshops()
        {
            var organizerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _workshopService.GetWorkshopsByOrganizer(organizerId);
            return Ok(result.Data);
        }

        // GET /api/workshop/{id} — public
        [HttpGet("{id}")]
        public ActionResult<Workshop> GetWorkshopById(int id)
        {
            var result = _workshopService.GetWorkshopById(id);
            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);
            return Ok(result.Data);
        }

        // POST /api/workshop — Organizer only
        [HttpPost]
        [Authorize(Roles = "Organizer")]
        public ActionResult<Workshop> CreateWorkshop([FromBody] Workshop workshop)
        {
            var organizerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _workshopService.CreateWorkshop(workshop, organizerId);

            if (result.Status == WorkshopResultStatus.ValidationError)
                return BadRequest(result.Message);
            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);

            return CreatedAtAction(nameof(GetWorkshopById), new { id = result.Data!.WorkshopId }, result.Data);
        }

        // PUT /api/workshop/{id} — Organizer only
        [HttpPut("{id}")]
        [Authorize(Roles = "Organizer")]
        public ActionResult<Workshop> UpdateWorkshop(int id, [FromBody] Workshop updatedData)
        {
            var organizerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _workshopService.UpdateWorkshop(id, updatedData, organizerId);

            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);
            if (result.Status == WorkshopResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            return Ok(result.Data);
        }

        // DELETE /api/workshop/{id} — Organizer only
        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizer")]
        public IActionResult DeleteWorkshop(int id)
        {
            var organizerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _workshopService.DeleteWorkshop(id, organizerId);

            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);
            if (result.Status == WorkshopResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            return Ok(new { Message = result.Message });
        }

        // PUT /api/workshop/{id}/approve — Admin/Manager only
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult ApproveWorkshop(int id)
        {
            var result = _workshopService.ApproveWorkshop(id);

            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);
            if (result.Status == WorkshopResultStatus.ValidationError)
                return BadRequest(result.Message);

            // Notify organizer by email
            _ = Task.Run(async () =>
            {
                var workshop = _workshopService.GetWorkshopById(id).Data;
                if (workshop?.OrganizerId != null)
                {
                    var organizer = _userService.GetUserById(workshop.OrganizerId.Value).Data;
                    if (organizer != null)
                    {
                        await _emailService.SendAsync(
                            organizer.Email, organizer.FullName,
                            $"✅ Workshop Approved: {workshop.Title}",
                            EmailTemplates.WorkshopApproved(organizer.FullName, workshop.Title));
                    }
                }
            });

            return Ok(new { Message = result.Message });
        }

        public class RejectWorkshopRequest
        {
            public string Reason { get; set; } = string.Empty;
        }

        // PUT /api/workshop/{id}/reject — Admin/Manager only
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult RejectWorkshop(int id, [FromBody] RejectWorkshopRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Reason))
                return BadRequest("A reason must be provided when rejecting a workshop.");

            var result = _workshopService.RejectWorkshop(id, request.Reason);

            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);
            if (result.Status == WorkshopResultStatus.ValidationError)
                return BadRequest(result.Message);

            // Notify organizer by email
            _ = Task.Run(async () =>
            {
                var workshop = _workshopService.GetWorkshopById(id).Data;
                if (workshop?.OrganizerId != null)
                {
                    var organizer = _userService.GetUserById(workshop.OrganizerId.Value).Data;
                    if (organizer != null)
                    {
                        await _emailService.SendAsync(
                            organizer.Email, organizer.FullName,
                            $"Workshop Update: {workshop.Title}",
                            EmailTemplates.WorkshopRejected(organizer.FullName, workshop.Title, request.Reason));
                    }
                }
            });

            return Ok(new { Message = result.Message });
        }
    }
}