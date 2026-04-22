using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        // POST /api/registration — Attendee only; UserId auto-set from token
        [HttpPost]
        [Authorize(Roles = "Attendee")]
        public IActionResult RegisterForWorkshop([FromBody] int workshopId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _registrationService.RegisterUser(userId, workshopId);

            if (result.Status == RegistrationResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == RegistrationResultStatus.Duplicate ||
                result.Status == RegistrationResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }

        // DELETE /api/registration/{id} — Attendee only; can only cancel their own
        [HttpDelete("{id}")]
        [Authorize(Roles = "Attendee")]
        public IActionResult CancelRegistration(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _registrationService.CancelRegistration(id, userId);

            if (result.Status == RegistrationResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == RegistrationResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            if (result.Status == RegistrationResultStatus.ValidationError)
                return BadRequest(result.Message);

            return Ok(new { Message = result.Message });
        }

        // GET /api/registration/workshop/{workshopId} — Organizer and Admin only
        [HttpGet("workshop/{workshopId}")]
        [Authorize(Roles = "Organizer,Admin")]
        public IActionResult GetWorkshopAttendees(int workshopId)
        {
            var result = _registrationService.GetAttendees(workshopId);

            if (result.Status == RegistrationResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(result.Data);
        }

        // GET /api/registration/my — Attendee only: view own bookings
        [HttpGet("my")]
        [Authorize(Roles = "Attendee")]
        public IActionResult GetMyBookings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _registrationService.GetUserRegistrations(userId);

            if (result.Status == RegistrationResultStatus.NotFound)
                return NotFound(result.Message);

            return Ok(result.Data);
        }
    }
}