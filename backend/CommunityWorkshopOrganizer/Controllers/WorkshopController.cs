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

        public WorkshopController(IWorkshopService workshopService)
        {
            _workshopService = workshopService;
        }

        // GET /api/workshop — public: attendees discover workshops (filter by status optional)
        [HttpGet]
        public ActionResult<IEnumerable<Workshop>> GetAllWorkshops([FromQuery] string? status)
        {
            var result = _workshopService.GetAllWorkshops(status);
            return Ok(result.Data);
        }

        // GET /api/workshop/my — Organiser only: get their own created workshops
        [HttpGet("my")]
        [Authorize(Roles = "Organiser")]
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

        // POST /api/workshop — Organiser only; OrganizerId auto-set from token
        [HttpPost]
        [Authorize(Roles = "Organiser")]
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

        // PUT /api/workshop/{id} — Organiser only; can only update their own workshop
        [HttpPut("{id}")]
        [Authorize(Roles = "Organiser")]
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

        // DELETE /api/workshop/{id} — Organiser only; can only delete their own workshop
        [HttpDelete("{id}")]
        [Authorize(Roles = "Organiser")]
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

        // PUT /api/workshop/{id}/approve — Admin only
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public IActionResult ApproveWorkshop(int id)
        {
            var result = _workshopService.ApproveWorkshop(id);

            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == WorkshopResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }

        public class RejectWorkshopRequest
        {
            public string Reason { get; set; } = string.Empty;
        }

        // PUT /api/workshop/{id}/reject — Admin only
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public IActionResult RejectWorkshop(int id, [FromBody] RejectWorkshopRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Reason))
                return BadRequest("A reason must be provided when rejecting a workshop.");

            var result = _workshopService.RejectWorkshop(id, request.Reason);

            if (result.Status == WorkshopResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == WorkshopResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }
    }
}