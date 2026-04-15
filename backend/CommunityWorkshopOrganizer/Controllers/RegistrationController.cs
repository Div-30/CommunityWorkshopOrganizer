using CommunityWorkshopOrganizer.Data;
using CommunityWorkshopOrganizer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityWorkshopOrganizer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly ApiContext _context;

        public RegistrationController(ApiContext context)
        {
            _context = context;
        }

        [HttpPost]
        public ActionResult<Registration> CreateRegistration([FromBody] Registration registration)
        {
            var workshop = _context.Workshops.Find(registration.WorkshopId);
            if (workshop == null)
            {
                return NotFound("Workshop not found.");
            }

            var existingRegistration = _context.Registrations
                .FirstOrDefault(r => r.UserId == registration.UserId && r.WorkshopId == registration.WorkshopId);
            
            if (existingRegistration != null)
            {
                return BadRequest("This user is already registered for this workshop.");
            }

            var currentAttendees = _context.Registrations
                .Count(r => r.WorkshopId == registration.WorkshopId && r.Status == "Confirmed");

            if (currentAttendees >= workshop.Capacity)
            {
                registration.Status = "Waitlisted";
            }
            else
            {
                registration.Status = "Confirmed";
            }

            registration.RegisteredAt = DateTime.UtcNow;

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            return Ok(registration);
        }
        
        [HttpGet("workshop/{workshopId}")]
        public ActionResult<IEnumerable<Registration>> GetWorkshopAttendees(int workshopId)
        {
            var workshopExists = _context.Workshops.Any(w => w.WorkshopId == workshopId);
            if (!workshopExists)
            {
                return NotFound("Workshop not found.");
            }

            var attendees = _context.Registrations
                .Include(r => r.User) 
                .Where(r => r.WorkshopId == workshopId)
                .OrderBy(r => r.RegisteredAt)
                .ToList();

            return Ok(attendees);
        }
    }
}
