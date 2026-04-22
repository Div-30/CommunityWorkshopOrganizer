using CommunityWorkshopOrganizer.Models;
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
        private readonly IUserService _userService;
        private readonly IWorkshopService _workshopService;
        private readonly IEmailService _emailService;

        public RegistrationController(
            IRegistrationService registrationService,
            IUserService userService,
            IWorkshopService workshopService,
            IEmailService emailService)
        {
            _registrationService = registrationService;
            _userService = userService;
            _workshopService = workshopService;
            _emailService = emailService;
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

            // Send confirmation email (fire-and-forget — never blocks response)
            _ = Task.Run(async () =>
            {
                var user = _userService.GetUserById(userId).Data;
                var workshop = _workshopService.GetWorkshopById(workshopId).Data;
                if (user != null && workshop != null)
                {
                    var eventDate = workshop.EventDate.ToString("dddd, MMMM d, yyyy 'at' h:mm tt");
                    await _emailService.SendAsync(
                        user.Email, user.FullName,
                        $"Registration Confirmed: {workshop.Title}",
                        EmailTemplates.RegistrationConfirmed(user.FullName, workshop.Title, eventDate));
                }
            });

            return Ok(result.Data);
        }

        // DELETE /api/registration/{id} — Attendee only; can only cancel their own
        [HttpDelete("{id}")]
        [Authorize(Roles = "Attendee")]
        public IActionResult CancelRegistration(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Look up the registration's workshopId BEFORE cancelling (for the email)
            var userRegs = _registrationService.GetUserRegistrations(userId).Data;
            var regToCancel = userRegs?.FirstOrDefault(r => r.RegistrationId == id);
            var workshopIdForEmail = regToCancel?.WorkshopId;

            var result = _registrationService.CancelRegistration(id, userId);

            if (result.Status == RegistrationResultStatus.NotFound)
                return NotFound(result.Message);

            if (result.Status == RegistrationResultStatus.Forbidden)
                return StatusCode(403, result.Message);

            if (result.Status == RegistrationResultStatus.ValidationError)
                return BadRequest(result.Message);

            // Send cancellation email (fire-and-forget)
            if (workshopIdForEmail.HasValue)
            {
                _ = Task.Run(async () =>
                {
                    var user = _userService.GetUserById(userId).Data;
                    var workshop = _workshopService.GetWorkshopById(workshopIdForEmail.Value).Data;
                    if (user != null && workshop != null)
                    {
                        await _emailService.SendAsync(
                            user.Email, user.FullName,
                            $"Registration Cancelled: {workshop.Title}",
                            EmailTemplates.RegistrationCancelled(user.FullName, workshop.Title));
                    }
                });
            }

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