using CommunityWorkshopOrganizer.Models;
using CommunityWorkshopOrganizer.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public ActionResult<Registration> CreateRegistration([FromBody] Registration registration)
        {
            var result = _registrationService.RegisterUser(registration);
            
            if (result.Status == RegistrationResultStatus.NotFound)
            {
                return NotFound(result.Message);
            }

            if (result.Status == RegistrationResultStatus.Duplicate || 
                result.Status == RegistrationResultStatus.ValidationError)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Data);
        }
        
        [HttpGet("workshop/{workshopId}")]
        public ActionResult<IEnumerable<Registration>> GetWorkshopAttendees(int workshopId)
        {
            var result = _registrationService.GetAttendees(workshopId);

            if (result.Status == RegistrationResultStatus.NotFound)
            {
                return NotFound(result.Message);
            }

            return Ok(result.Data);
        }
    }
}